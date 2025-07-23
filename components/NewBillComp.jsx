"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { getProducts } from "@/redux/slices/productsSlice";
import { createBill, removeCreated } from "@/redux/slices/billsSlice";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Package, ArrowLeft, Receipt } from "lucide-react";
import Link from "next/link";

const NewBillComp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const role = useSelector((state) => state.user.role);
  const created = useSelector((state) => state.bills.created);
  const products = useSelector((state) => state.products.products);
  const [billProducts, setBillProducts] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [billType, setBillType] = useState("buy");

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getProducts());
    } else {
      dispatch(getProducts());
    }
  }, [products.length, dispatch]);

  const resetForm = () => {
    setBillProducts([]);
    setHasSubmitted(false);
    setBillType("buy");
    const form = document.querySelector("form");
    if (form) {
      form.reset();
    }
  };

  if (role !== "ADMIN") {
    router.push("/");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const formData = new FormData(e.target);

    // Deduplicate products based on product ID
    let valid = true;
    const prods = billProducts.reduce((uniqueProds, currentProduct) => {
      const existingProduct = uniqueProds.find(
        (prod) => prod.product === currentProduct.product
      );
      if (currentProduct.quantity < 0) {
        toast.error("Quantity must be positive");
        valid = false;
        return uniqueProds;
      } else if (currentProduct.quantity > 0) {
        if (existingProduct) {
          existingProduct.quantity += Number.parseInt(
            currentProduct.quantity,
            10
          );
        } else {
          uniqueProds.push({
            ...currentProduct,
            quantity: Number.parseInt(currentProduct.quantity, 10),
          });
        }
      }
      return uniqueProds;
    }, []);

    if (prods.length === 0) {
      toast.error("You must add at least one product");
      valid = false;
    }

    const form = {
      type: formData.get("type"),
      date: formData.get("date"),
      price: formData.get("price"),
      products: prods,
    };

    if (valid) {
      dispatch(createBill(form));
    }
  };

  const addProduct = () => {
    if (products.length === 0) {
      toast.error("No products available. Please add products first.");
      return;
    }
    const product = {
      index: billProducts.length + 1,
      product: products[0].id,
      quantity: 1,
    };
    setBillProducts([...billProducts, product]);
  };

  const deleteProduct = (index) => {
    setBillProducts(billProducts.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, value) => {
    const updatedProducts = [...billProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      product: value,
    };
    setBillProducts(updatedProducts);
  };

  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...billProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      quantity: Number.parseInt(value, 10) || 0,
    };
    setBillProducts(updatedProducts);
  };

  const calculateTotal = () => {
    return billProducts.reduce((total, item) => {
      const product = products.find((p) => p.id === item.product);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  useEffect(() => {
    if (created && hasSubmitted) {
      toast.success("Bill created successfully!", {
        duration: 4000,
        position: "top-center",
      });
      dispatch(removeCreated());
    }
  }, [created, router, hasSubmitted, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/seller">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Receipt className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Bill
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create a new purchase or sale transaction record
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Bill Details</CardTitle>
              <CardDescription>
                Fill in the transaction information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Bill Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Transaction Type</Label>
                    <Select
                      name="type"
                      value={billType}
                      onValueChange={setBillType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">
                          <div className="flex items-center">
                            <Badge variant="secondary" className="mr-2">
                              BUY
                            </Badge>
                            Purchase from supplier
                          </div>
                        </SelectItem>
                        <SelectItem value="sell">
                          <div className="flex items-center">
                            <Badge variant="secondary" className="mr-2">
                              SELL
                            </Badge>
                            Sale to customer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Transaction Date</Label>
                    <Input type="date" name="date" required className="h-10" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Total Amount ($)</Label>
                    <Input
                      type="number"
                      name="price"
                      required
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="h-10"
                    />
                  </div>
                </div>

                <Separator />

                {/* Products Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Products</h3>
                      <p className="text-sm text-gray-600">
                        Add products to this transaction
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={addProduct}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>

                  {billProducts.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-center">
                          No products added yet.
                          <br />
                          Click &quot;Add Product&quot; to get started.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {billProducts.map((product, index) => {
                        const productInfo = products.find(
                          (p) => p.id === product.product
                        );
                        return (
                          <Card
                            key={index}
                            className="border-l-4 border-l-blue-500"
                          >
                            <CardContent className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="md:col-span-2 space-y-2">
                                  <Label>Product</Label>
                                  <Select
                                    value={product.product?.toString() || ""}
                                    onValueChange={(value) =>
                                      handleProductChange(
                                        index,
                                        Number.parseInt(value, 10)
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {products.map((prod) => (
                                        <SelectItem
                                          key={prod.id}
                                          value={prod.id.toString()}
                                        >
                                          <div className="flex items-center justify-between w-full">
                                            <span>
                                              {prod.brand} {prod.name}
                                            </span>
                                            <Badge
                                              variant="outline"
                                              className="ml-2"
                                            >
                                              ${prod.price}
                                            </Badge>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Quantity</Label>
                                  <Input
                                    type="number"
                                    value={product.quantity}
                                    min="1"
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    className="h-10"
                                  />
                                </div>

                                <div className="flex items-end space-x-2">
                                  {productInfo && (
                                    <div className="text-right flex-1">
                                      <p className="text-sm text-gray-500">
                                        Subtotal
                                      </p>
                                      <p className="font-semibold text-blue-600">
                                        $
                                        {(
                                          productInfo.price * product.quantity
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                  )}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteProduct(index)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}

                      {/* Calculated Total */}
                      {billProducts.length > 0 && (
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold">
                                Calculated Total:
                              </span>
                              <span className="text-2xl font-bold text-blue-600">
                                ${calculateTotal().toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              This is automatically calculated based on selected
                              products
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="bg-transparent"
                  >
                    <Link href="/seller">Cancel</Link>
                  </Button>
                  <Button type="submit" className="min-w-[120px]">
                    <Receipt className="h-4 w-4 mr-2" />
                    Create Bill
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewBillComp;
