'use client'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast, { Toaster } from 'react-hot-toast';
//const notify = () => toast('success payement', { icon: '🚀' });
import withRole from "@/utils/withRole";


function Paypal() {
    return (
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_CLIENT_ID }}>
            <PayPalButtons style={{ layout: "horizontal" }} 
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: "50",
                                },
                            },
                        ],
                    });
                }}
                onApprove={ (data, actions) => {
                        return actions.order.capture().then(function(details) {
                            toast.success(
                                'payement successfull, thank you ' + details.payer.name.given_name, 
                                { 
                                    
                                    duration: 5000
                                }
                            );
                        });
                    }
                }
                onCancel={
                    () => toast(
                            'You cancelled the payement', 
                            { 
                                icon: '🚫',
                                duration: 5000
                            }
                        )
                }
                onError={
                    () => toast.error(
                            'An error occured with ur payement, please try again', 
                            { duration: 5000 }
                        )
                }
            />
             <Toaster />    
        </PayPalScriptProvider>
    );
}

export default withRole(Paypal, ["ADMIN", "CLIENT"]);