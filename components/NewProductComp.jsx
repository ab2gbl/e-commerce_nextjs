"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { createProduct, removeCreated } from "@/redux/slices/productsSlice";
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
import { Textarea } from "@/components/ui/textarea";
import { Smartphone, Headphones, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

const NewProductComp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const role = useSelector((state) => state.user.role);
  const created = useSelector((state) => state.products.created);
  const [type, setType] = useState("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneFields, setPhoneFields] = useState({
    dimensions: "",
    weight: "",
    cpu: "",
    memory: "",
    ram: "",
    battery: "",
    camera: "",
    os: "",
    other_details: "",
  });
  const [accessoryFields, setAccessoryFields] = useState({
    dimensions: "",
    weight: "",
    other_details: "",
  });

  if (role !== "ADMIN") {
    router.push("/");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const form = {
      type: formData.get("type"),
      brand: formData.get("brand"),
      name: formData.get("name"),
      image: formData.get("image"),
      price: formData.get("price"),
      ...phoneFields,
      ...accessoryFields,
    };
    dispatch(createProduct(form));
    setPhoneFields({
      dimensions: "",
      weight: "",
      cpu: "",
      memory: "",
      ram: "",
      battery: "",
      camera: "",
      os: "",
      other_details: "",
    });
    setAccessoryFields({ dimensions: "", weight: "", other_details: "" });
    e.target.reset();
    setIsLoading(false);
  };

  // In NewProductComp.jsx
  // In NewProductComp.jsx - remove this line
  // <Toaster />

  useEffect(() => {
    if (created) {
      toast.success("Product created successfully!", {
        duration: 4000,
        position: "top-center",
      });
      dispatch(removeCreated());
      router.push("/seller"); // Immediate redirect
    }
  }, [created, router, dispatch]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add New Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create a new phone or accessory listing for your store
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {type === "phone" ? (
                  <Smartphone className="h-5 w-5" />
                ) : (
                  <Headphones className="h-5 w-5" />
                )}
                <span>Product Details</span>
              </CardTitle>
              <CardDescription>
                Fill in the information for your new product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Product Type</Label>
                    <Select name="type" value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" />
                            Phone
                          </div>
                        </SelectItem>
                        <SelectItem value="accessory">
                          <div className="flex items-center">
                            <Headphones className="h-4 w-4 mr-2" />
                            Accessory
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      type="text"
                      name="brand"
                      required
                      placeholder="e.g., Apple, Samsung, Sony"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g., iPhone 15 Pro, Galaxy S24"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <Input
                      type="file"
                      name="image"
                      required
                      accept="image/*"
                      className="h-10"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload a high-quality product image
                  </p>
                </div>

                {/* Product Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Product Specifications
                  </h3>

                  {type === "phone" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Dimensions</Label>
                        <Input
                          type="text"
                          placeholder="e.g., 146.7 x 71.5 x 7.8 mm"
                          value={phoneFields.dimensions}
                          onChange={(e) =>
                            setPhoneFields((f) => ({
                              ...f,
                              dimensions: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Weight</Label>
                        <Input
                          type="text"
                          placeholder="e.g., 188g"
                          value={phoneFields.weight}
                          onChange={(e) =>
                            setPhoneFields((f) => ({
                              ...f,
                              weight: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CPU</Label>
                        <Input
                          type="text"
                          placeholder="e.g., A17 Pro chip"
                          value={phoneFields.cpu}
                          onChange={(e) =>
                            setPhoneFields((f) => ({
                              ...f,
                              cpu: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Storage</Label>
                        <Input
                          type="text"
                          placeholder="e.g., 128GB, 256GB, 512GB"
                          value={phoneFields.memory}
                          onChange={(e) =>
                            setPhoneFields((f) => ({
                              ...f,
                              memory: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>RAM</Label>
                        <Input
                          type="text"
                          placeholder="e.g., 8GB"
                          value={phoneFields.ram}
                          onChange={(e) =>
                            setPhoneFields((f) => ({
                              ...f,
                              ram: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Battery</Label>
                        <Input
                          type="text"
                          placeholder="e.g., 3274 mAh"
                          value={phoneFields.battery}
                          onChange={(e) =>
                            setPhoneFields((f) => ({
                              ...f,
                              battery: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Camera</Label>
                        <Input
                          type="text"
                          placeholder="e.g., 48MP Main + 12MP Ultra Wide"
                          value={phoneFields.camera}
                          onChange={(e) =>
                            setPhoneFields((f) => ({
                              ...f,
                              camera: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Operating System</Label>
                        <Input
                          type="text"
                          placeholder="e.g., iOS 17, Android 14"
                          value={phoneFields.os}
                          onChange={(e) =>
                            setPhoneFields((f) => ({
                              ...f,
                              os: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Additional Details</Label>
                        <Textarea
                          placeholder="Any other important specifications or features"
                          value={phoneFields.other_details}
                          onChange={(e) =>
                            setPhoneFields((f) => ({
                              ...f,
                              other_details: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Dimensions</Label>
                        <Input
                          type="text"
                          placeholder="e.g., 190 x 160 x 78 mm"
                          value={accessoryFields.dimensions}
                          onChange={(e) =>
                            setAccessoryFields((f) => ({
                              ...f,
                              dimensions: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Weight</Label>
                        <Input
                          type="text"
                          placeholder="e.g., 250g"
                          value={accessoryFields.weight}
                          onChange={(e) =>
                            setAccessoryFields((f) => ({
                              ...f,
                              weight: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Additional Details</Label>
                        <Textarea
                          placeholder="Describe the accessory features, compatibility, etc."
                          value={accessoryFields.other_details}
                          onChange={(e) =>
                            setAccessoryFields((f) => ({
                              ...f,
                              other_details: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4 pt-6">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "Creating..." : "Create Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="flex-1 bg-transparent"
                  >
                    <Link href="/seller">Cancel</Link>
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

export default NewProductComp;
