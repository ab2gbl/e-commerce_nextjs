"use client"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import toast, { Toaster } from "react-hot-toast"
import withRole from "@/utils/withRole"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

function Paypal() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PayPal Test</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Test PayPal integration with a sample payment</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Test Payment</CardTitle>
              <CardDescription>This is a test payment of $50.00</CardDescription>
            </CardHeader>
            <CardContent>
              <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_CLIENT_ID }}>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Test Amount</p>
                    <p className="text-3xl font-bold text-blue-600">$50.00</p>
                  </div>

                  <PayPalButtons
                    style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: "50",
                            },
                          },
                        ],
                      })
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        toast.success(`Payment successful! Thank you ${details.payer.name.given_name}`, {
                          duration: 5000,
                          position: "top-center",
                        })
                      })
                    }}
                    onCancel={() =>
                      toast("Payment cancelled", {
                        icon: "🚫",
                        duration: 5000,
                      })
                    }
                    onError={() =>
                      toast.error("An error occurred with your payment, please try again", { duration: 5000 })
                    }
                  />
                </div>
              </PayPalScriptProvider>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default withRole(Paypal, ["ADMIN", "CLIENT"])
