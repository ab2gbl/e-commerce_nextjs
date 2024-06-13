'use client'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useSelector ,useDispatch} from 'react-redux';
import { removeAll } from "@/redux/slices/cartSlice";

export default function PayAll() {
    const products = useSelector((state) => state.cart.products);
    const dispatch=useDispatch()
    const [totalPrice, setTotalPrice] = useState(0);
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


    const makeBills = () => {
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
            "price": totalPrice
        }

        let dataForm = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        };
    
        fetch('http://127.0.0.1:8000/product/bills/', dataForm)
            .then(response => console.log("sent"))
        
        dispatch(removeAll())
            
        
        

        
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
                        makeBills()
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
    }, [totalPrice]);

    return (
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_CLIENT_ID }}>
            {paypalButton}
            <Toaster />
        </PayPalScriptProvider>
    );
}
