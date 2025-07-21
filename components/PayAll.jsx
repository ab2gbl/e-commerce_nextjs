'use client'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useSelector ,useDispatch} from 'react-redux';
import { removeAll } from "@/redux/slices/cartSlice";
import { createBill } from "@/redux/slices/billsSlice";
import { useRouter } from "next/navigation";

export default function PayAll({ onPaymentSuccess }) {
    const products = useSelector((state) => state.cart.products);
    const username = useSelector((state) => state.user.username);
    const dispatch=useDispatch()
    const router = useRouter();
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    function calculateTotalPrice() {
        let t = 0;
        for (let i = 0; i < products.length; i++) {
            const obj = products[i];
            const count = obj.count;
            const price = obj.product.price * count;
            t = t+price;
            
        }
        setTotalPrice(t);
    }
    const [paypalButtonKey, setPaypalButtonKey] = useState(0); // Key for re-rendering PayPal button
    const [paypalButton, setPaypalButton] = useState(null);
    
    useEffect(() => {
        calculateTotalPrice()
    }, [products]);


    const makeBills = async () => {
        const date = new Date();
                        
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${year}-${month}-${day}`;

        let formProducts = [];

        for (let i = 0; i < products.length; i++){
            let obj = products[i];
            formProducts.push({product: obj.product.id, quantity: obj.count})
        }



        let form = { 
            "type": "sell",
            "date": currentDate,
            "products": formProducts,
            "price": totalPrice,
            "user": username
        }

        try {
            await dispatch(createBill(form)).unwrap();
            dispatch(removeAll());
            setPaymentCompleted(true);
            // Removed duplicate notification - will be handled in onApprove
        } catch (e) {
            toast.error('Failed to confirm purchase. Please try again.', { duration: 5000 });
        }
    };

    useEffect(() => {
        //console.log(totalPrice);

        // Define createOrder function inside useEffect to capture updated price
        const createOrderFunction = (data, actions) => {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: totalPrice.toFixed(2)
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
                        makeBills();
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
    }, [totalPrice]);

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
                            onClick={() => {
                                setTimeout(() => {
                                    router.push('/');
                                }, 400); // Delay to let PayPal cleanup
                            }}
                        >
                            Continue Shopping
                        </button>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium transition duration-200"
                            onClick={() => {
                                if (onPaymentSuccess) onPaymentSuccess();
                            }}
                        >
                            Close
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
