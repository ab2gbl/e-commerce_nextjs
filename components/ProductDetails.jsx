"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeProduct } from "@/redux/slices/productsSlice";
import { addProduct } from "@/redux/slices/cartSlice";
import { initAuth } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShoppingCart,
  Edit,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Star,
  Smartphone,
  Headphones,
  Package,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function ProductDetails({ id }) {
  const router = useRouter();
  const products = useSelector((state) => state.products);
  const role = useSelector((state) => state.user.role);
  const isLog = useSelector((state) => state.user.isLog);

  const [showAddToCart, setShowAddToCart] = useState(false);
  const [count, setCount] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProduct(id));
    if (!isLog) {
      initAuth();
    }
    // eslint-disable-next-line
  }, [id]);

  function addToCart() {
    if (count > 0 && count <= (products.product?.in_stock || 0)) {
      setIsAddingToCart(true);
      dispatch(addProduct({ count: count, product: products.product }));

      setTimeout(() => {
        setIsAddingToCart(false);
        toast.success(
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Added to cart successfully!</span>
          </div>,
          {
            duration: 3000,
            position: "top-center",
          }
        );
        setShowAddToCart(false);
        setCount(1);
      }, 500);
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(removeProduct(id.id));
      toast.success("Product deleted successfully");
      router.push("/seller");
    }
  };

  if (products.isProductLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!products.product || !products.product.id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const product = products.product;
  const isOutOfStock = product.in_stock === 0;
  const isLowStock = product.in_stock <= 5 && product.in_stock > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster />
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square bg-white flex items-center justify-center">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {product.type === "phone" ? (
                        <Smartphone className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Headphones className="h-5 w-5 text-purple-600" />
                      )}
                      <Badge variant="secondary" className="capitalize">
                        {product.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                      {product.brand} {product.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        (4.5) • 128 reviews
                      </span>
                    </div>
                  </div>
                  {role === "ADMIN" && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/products/edit/${product.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price and Stock */}
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-blue-600">
                    ${product.price}
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={product.available ? "default" : "destructive"}
                    >
                      {product.available ? "Available" : "Unavailable"}
                    </Badge>
                    {isLowStock && (
                      <Badge
                        variant="outline"
                        className="text-orange-600 border-orange-200"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Only {product.in_stock} left
                      </Badge>
                    )}
                    {!isOutOfStock && !isLowStock && (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        In Stock ({product.in_stock})
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Add to Cart Section */}
                {!isOutOfStock && (
                  <div className="space-y-4">
                    {!showAddToCart ? (
                      <Button
                        onClick={() => setShowAddToCart(true)}
                        className="w-full h-12 text-lg"
                        disabled={!product.available}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium">Quantity:</span>
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCount(Math.max(1, count - 1))}
                              disabled={count <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              max={product.in_stock}
                              value={count}
                              onChange={(e) => {
                                const newValue = Number.parseInt(
                                  e.target.value,
                                  10
                                );
                                if (
                                  newValue >= 1 &&
                                  newValue <= product.in_stock
                                ) {
                                  setCount(newValue);
                                }
                              }}
                              className="w-16 text-center border-0 focus:ring-0"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setCount(Math.min(product.in_stock, count + 1))
                              }
                              disabled={count >= product.in_stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="text-sm text-gray-500">
                            Max: {product.in_stock}
                          </span>
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            onClick={addToCart}
                            disabled={isAddingToCart}
                            className="flex-1"
                          >
                            {isAddingToCart ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add {count} to Cart
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAddToCart(false)}
                            className="bg-transparent"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isOutOfStock && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This product is currently out of stock.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Product Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.type === "phone" ? (
                    <>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">
                          Dimensions
                        </span>
                        <p className="text-sm">
                          {product.details?.dimensions || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">
                          Weight
                        </span>
                        <p className="text-sm">
                          {product.details?.weight || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">
                          CPU
                        </span>
                        <p className="text-sm">
                          {product.details?.cpu || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">
                          Storage
                        </span>
                        <p className="text-sm">
                          {product.details?.memory || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">
                          RAM
                        </span>
                        <p className="text-sm">
                          {product.details?.ram || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">
                          Battery
                        </span>
                        <p className="text-sm">
                          {product.details?.battery || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">
                          Camera
                        </span>
                        <p className="text-sm">
                          {product.details?.camera || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">
                          OS
                        </span>
                        <p className="text-sm">
                          {product.details?.os || "Not specified"}
                        </p>
                      </div>
                      {product.details?.other_details && (
                        <div className="space-y-1 md:col-span-2">
                          <span className="text-sm font-medium text-gray-500">
                            Additional Details
                          </span>
                          <p className="text-sm">
                            {product.details.other_details}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">
                          Dimensions
                        </span>
                        <p className="text-sm">
                          {product.details?.dimensions || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">
                          Weight
                        </span>
                        <p className="text-sm">
                          {product.details?.weight || "Not specified"}
                        </p>
                      </div>
                      {product.details?.other_details && (
                        <div className="space-y-1 md:col-span-2">
                          <span className="text-sm font-medium text-gray-500">
                            Details
                          </span>
                          <p className="text-sm">
                            {product.details.other_details}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
