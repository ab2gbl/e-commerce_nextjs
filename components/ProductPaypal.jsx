'use client'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import { removeProduct } from "@/redux/slices/cartSlice";
export default function ProductPaypal({ obj, count }) {
    const [price, setPrice] = useState(obj.product.price * count);
    const [paypalButtonKey, setPaypalButtonKey] = useState(0); // Key for re-rendering PayPal button
    const [paypalButton, setPaypalButton] = useState(null);
    
    const dispatch=useDispatch()
    
    const makeBill = () => {
        console.log("start")
        const date = new Date();
                        
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let currentDate = `${year}-${month}-${day}`;
        console.log(currentDate)
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
        }
        const dataForm = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        };

        fetch('http://127.0.0.1:8000/product/bills/', dataForm)
            .then(response => console.log("sent"))
        dispatch(removeProduct (obj.product.id))

        
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
                        
                        toast.success(
                            'Payment successful, thank you ' + details.payer.name.given_name,
                            { duration: 5000 }
                        );
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
            {paypalButton}
            <Toaster />
        </PayPalScriptProvider>
    );
}
