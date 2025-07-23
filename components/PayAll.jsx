"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeAll } from "@/redux/slices/cartSlice";
import { createBill } from "@/redux/slices/billsSlice";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, Home, Loader2 } from "lucide-react";

export default function PayAll({ onPaymentSuccess }) {
  const products = useSelector((state) => state.cart.products);
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  function calculateTotalPrice() {
    let t = 0;
    for (let i = 0; i < products.length; i++) {
      const obj = products[i];
      const count = obj.count;
      const price = obj.product.price * count;
      t = t + price;
    }
    setTotalPrice(t);
  }

  const [paypalButtonKey, setPaypalButtonKey] = useState(0);
  const [paypalButton, setPaypalButton] = useState(null);

  useEffect(() => {
    calculateTotalPrice();
  }, [products]);

  const makeBills = async () => {
    setIsProcessing(true);
    const date = new Date();

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const currentDate = `${year}-${month}-${day}`;

    const formProducts = [];

    for (let i = 0; i < products.length; i++) {
      const obj = products[i];
      formProducts.push({ product: obj.product.id, quantity: obj.count });
    }

    const form = {
      type: "sell",
      date: currentDate,
      products: formProducts,
      price: totalPrice,
      user: username,
    };

    try {
      await dispatch(createBill(form)).unwrap();
      dispatch(removeAll());
      setPaymentCompleted(true);
      toast.success("Order placed successfully!");
    } catch (e) {
      toast.error("Failed to confirm purchase. Please try again.", {
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Define createOrder function inside useEffect to capture updated price
    const createOrderFunction = (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: totalPrice.toFixed(2),
            },
          },
        ],
      });
    };

    // Remove existing PayPal button and re-add with updated createOrder function
    setPaypalButtonKey((prevKey) => prevKey + 1);

    setPaypalButton(
      <PayPalButtons
        key={paypalButtonKey}
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
        }}
        createOrder={createOrderFunction}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            makeBills();
          });
        }}
        onCancel={() =>
          toast("Payment cancelled", {
            icon: "🚫",
            duration: 5000,
          })
        }
        onError={() =>
          toast.error("An error occurred with your payment, please try again", {
            duration: 5000,
          })
        }
      />
    );
  }, [totalPrice]);

  if (paymentCompleted) {
    return (
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Order Placed Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed and
                will be processed shortly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  setTimeout(() => {
                    router.push("/");
                  }, 400);
                }}
                className="flex items-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  router.push("/mybills");
                }}
                className="flex items-center bg-transparent"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                View Orders
              </Button>
              {onPaymentSuccess && (
                <Button variant="ghost" onClick={onPaymentSuccess}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <PayPalScriptProvider
      options={{ clientId: process.env.NEXT_PUBLIC_CLIENT_ID }}
    >
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
          <div className="space-y-2">
            {products.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between text-sm"
              >
                <span className="text-gray-600">
                  {item.product.name} × {item.count}
                </span>
                <span className="font-medium">
                  ${(item.product.price * item.count).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PayPal Button */}
        {/* PayPal Button */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Complete your purchase securely with PayPal
            </p>

            {/* Test Account Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-blue-500 rounded-full p-1 mr-2">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
                  Test Account
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs text-blue-600 font-medium">
                    Email:
                  </span>
                  <code className="text-xs bg-white px-2 py-1 rounded border text-gray-800 break-all">
                    sb-ey9ds29899845@personal.example.com
                  </code>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs text-blue-600 font-medium">
                    Password:
                  </span>
                  <code className="text-xs bg-white px-2 py-1 rounded border text-gray-800">
                    FDTaK=6^
                  </code>
                </div>
              </div>
            </div>
          </div>

          {isProcessing ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Processing your order...</span>
            </div>
          ) : (
            paypalButton
          )}
        </div>
      </div>
      <Toaster />
    </PayPalScriptProvider>
  );
}
