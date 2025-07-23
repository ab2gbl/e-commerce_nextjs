"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { updateCount, removeProduct, addProduct } from "@/redux/slices/cartSlice"
import PayAll from "./PayAll"
import api from "@/utils/api"
import toast, { Toaster } from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft, Package } from "lucide-react"

export default function Cart() {
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

  // Load cart from localStorage if Redux cart is empty
  useEffect(() => {
    if (cart.products.length === 0) {
      const storedCart = localStorage.getItem("cartProducts")
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart)
          if (Array.isArray(parsed)) {
            parsed.forEach((item) => {
              dispatch(addProduct(item))
            })
          }
        } catch (e) {
          // ignore parse errors
        }
      }
    }
    // eslint-disable-next-line
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(cart.products))
  }, [cart.products])

  const updateProductCount = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeProduct(productId))
    } else {
      dispatch(updateCount({ productId, newQuantity }))
    }
  }

  const remove = (productId) => {
    dispatch(removeProduct(productId))
    toast.success("Item removed from cart")
  }

  const checkProductAvailability = async () => {
    setIsCheckingAvailability(true)
    try {
      const unavailableProducts = []
      // Check each product in the cart
      for (const item of cart.products) {
        try {
          const response = await api.get(`/product/product/${item.product.id}`)
          const currentProduct = response.data
          if (!currentProduct.available) {
            unavailableProducts.push({
              name: item.product.name,
              reason: "Product is no longer available",
            })
            continue
          }
          if (currentProduct.in_stock < item.count) {
            unavailableProducts.push({
              name: item.product.name,
              reason: `Only ${currentProduct.in_stock} items available`,
            })
            continue
          }
        } catch (err) {
          if (err.response && err.response.status === 404) {
            unavailableProducts.push({
              name: item.product.name,
              reason: "Product has been deleted",
            })
          } else {
            throw err
          }
        }
      }
      if (unavailableProducts.length > 0) {
        const messages = unavailableProducts.map((p) => `${p.name}: ${p.reason}`)
        toast.error(
          <div>
            <p>Some products are not available:</p>
            <ul>
              {messages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>,
          { duration: 5000 },
        )
        return false
      }
      return true
    } catch (error) {
      toast.error("Failed to verify product availability. Please try again.")
      return false
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  const handleCheckoutClick = async () => {
    const isAvailable = await checkProductAvailability()
    if (isAvailable) {
      setShowModal(true)
    }
  }

  const calculateTotal = () => {
    return cart.products.reduce((total, item) => total + item.product.price * item.count, 0)
  }

  const calculateItemCount = () => {
    return cart.products.reduce((total, item) => total + item.count, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
            {cart.products.length > 0 && (
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {calculateItemCount()} items
              </Badge>
            )}
          </div>
        </div>

        {cart.products.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.products.map((item) => (
                <Card key={item.product.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {item.product.brand} {item.product.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 capitalize">{item.product.type}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={item.product.available ? "default" : "destructive"}>
                              {item.product.available ? "In Stock" : "Out of Stock"}
                            </Badge>
                            <span className="text-sm text-gray-500">Stock: {item.product.in_stock}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateProductCount(item.product.id, item.count - 1)}
                                disabled={item.count <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                max={item.product.in_stock}
                                value={item.count}
                                onChange={(e) => {
                                  const newValue = Number.parseInt(e.target.value, 10)
                                  if (newValue > 0 && newValue <= item.product.in_stock) {
                                    updateProductCount(item.product.id, newValue)
                                  }
                                }}
                                className="w-16 text-center border-0 focus:ring-0"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateProductCount(item.product.id, item.count + 1)}
                                disabled={item.count >= item.product.in_stock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Price and Actions */}
                          <div className="flex items-center justify-between sm:justify-end space-x-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Unit Price</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${item.product.price}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Total</p>
                              <p className="text-lg font-bold text-blue-600">
                                ${(item.product.price * item.count).toFixed(2)}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => remove(item.product.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Product Link */}
                        <div>
                          <Button variant="link" asChild className="p-0 h-auto">
                            <Link href={`/products/details/${item.product.id}`}>View Product Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cart.products.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product.name} × {item.count}
                        </span>
                        <span className="font-medium">${(item.product.price * item.count).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">${calculateTotal().toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={handleCheckoutClick}
                    disabled={isCheckingAvailability}
                    className="w-full h-12 text-lg"
                  >
                    {isCheckingAvailability ? (
                      "Checking availability..."
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-500">
                    <p>Secure checkout with PayPal</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <Card className="w-full max-w-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Secure Checkout</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  ×
                </Button>
              </CardHeader>
              <CardContent>
                <PayAll onPaymentSuccess={() => setShowModal(false)} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
