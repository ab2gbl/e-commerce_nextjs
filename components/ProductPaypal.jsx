'use client'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { removeProduct } from "@/redux/slices/cartSlice";
import { createBill } from "@/redux/slices/billsSlice";
import { useRouter } from "next/navigation";

export default function ProductPaypal({ obj, count }) {
    const [price, setPrice] = useState(obj.product.price * count);
    const [paypalButtonKey, setPaypalButtonKey] = useState(0); // Key for re-rendering PayPal button
    const [paypalButton, setPaypalButton] = useState(null);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    
    const dispatch=useDispatch()
    const router = useRouter();
    
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://e-commerce-django-hsld.onrender.com";

    const makeBill = async () => {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${year}-${month}-${day}`;
        const form = { 
            "type": "sell",
            "date": currentDate,
            "products": [
                {
                    "product": obj.product.id,
                    "quantity": count   
                }
            ],
            "price": price
        };
        try {
            await dispatch(createBill(form)).unwrap();
            dispatch(removeProduct(obj.product.id));
            setPaymentCompleted(true);
            // Removed duplicate notification - will be handled in onApprove
        } catch (e) {
            toast.error('Failed to confirm purchase. Please try again.', { duration: 5000 });
        }
      };

    useEffect(() => {
        setPrice(obj.product.price * count);
    }, [count]);

    useEffect(() => {
        //console.log(price);

        // Define createOrder function inside useEffect to capture updated price
        const createOrderFunction = (data, actions) => {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: price.toFixed(2)
                        },
                    },
                ],
            });
        };

        // Remove existing PayPal button and re-add with updated createOrder function
        setPaypalButtonKey(prevKey => prevKey + 1);

        setPaypalButton(
            <PayPalButtons
                key={paypalButtonKey}
                style={{ layout: "horizontal" }}
                createOrder={createOrderFunction}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(function (details) {
                        makeBill();
                        console.log("end")
                    });
                }}
                onCancel={() => toast(
                    'You cancelled the payment',
                    {
                        icon: '🚫',
                        duration: 5000
                    }
                )}
                onError={() => toast.error(
                    'An error occurred with your payment, please try again',
                    { duration: 5000 }
                )}
            />
        );
    }, [price]);

    return (
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_CLIENT_ID }}>
            {paymentCompleted ? (
                <div className="text-center py-8">
                    <div className="mb-4">
                        <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Placed Successfully!</h3>
                    <p className="text-gray-600 mb-4">Your order has been confirmed and sent to our system.</p>
                    <div className="flex space-x-3 justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition duration-200"
                            onClick={() => router.push('/')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            ) : (
                paypalButton
            )}
            <Toaster />
        </PayPalScriptProvider>
    );
}
