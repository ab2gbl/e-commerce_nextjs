"use client"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import toast, { Toaster } from "react-hot-toast"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { createBill } from "@/redux/slices/billsSlice"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag, Home, Loader2 } from "lucide-react"

export default function ProductPaypal({ product, count, username }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [totalPrice, setTotalPrice] = useState(0)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (product && count) {
      setTotalPrice(product.price * count)
    }
  }, [product, count])

  const makeBill = async () => {
    setIsProcessing(true)
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const currentDate = `${year}-${month}-${day}`

    const form = {
      type: "sell",
      date: currentDate,
      products: [{ product: product.id, quantity: count }],
      price: totalPrice,
      user: username,
    }

    try {
      await dispatch(createBill(form)).unwrap()
      setPaymentCompleted(true)
      toast.success("Order placed successfully!")
    } catch (e) {
      toast.error("Failed to confirm purchase. Please try again.", { duration: 5000 })
    } finally {
      setIsProcessing(false)
    }
  }

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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed and will be processed shortly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  setTimeout(() => {
                    router.push("/")
                  }, 400)
                }}
                className="flex items-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  router.push("/mybills")
                }}
                className="flex items-center bg-transparent"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                View Orders
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_CLIENT_ID }}>
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {product?.brand} {product?.name} × {count}
              </span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PayPal Button */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Complete your purchase securely with PayPal</p>
          </div>
          {isProcessing ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Processing your order...</span>
            </div>
          ) : (
            <PayPalButtons
              style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: totalPrice.toFixed(2),
                      },
                    },
                  ],
                })
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  makeBill()
                })
              }}
              onCancel={() =>
                toast("Payment cancelled", {
                  icon: "🚫",
                  duration: 5000,
                })
              }
              onError={() => toast.error("An error occurred with your payment, please try again", { duration: 5000 })}
            />
          )}
        </div>
      </div>
      <Toaster />
    </PayPalScriptProvider>
  )
}
