"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProduct, editProduct } from "@/redux/slices/productsSlice"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, X, Upload, Smartphone, Headphones, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ProductEditComp({ id }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const products = useSelector((state) => state.products)

  const [formValues, setFormValues] = useState({
    id: id.id,
    brand: "",
    name: "",
    price: "",
    imageUrl: "",
    image: null,
  })
  const [type, setType] = useState("")
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
  })
  const [accessoryFields, setAccessoryFields] = useState({
    dimensions: "",
    weight: "",
    other_details: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(getProduct(id))
  }, [dispatch, id])

  useEffect(() => {
    if (products.product && !products.isProductLoading) {
      setFormValues({
        id: id.id,
        brand: products.product.brand || "",
        name: products.product.name || "",
        price: products.product.price || "",
        imageUrl: products.product.image || "",
        image: null,
      })
      setType(products.product.type || "")
      setPhoneFields({
        dimensions: products.product.details?.dimensions || "",
        weight: products.product.details?.weight || "",
        cpu: products.product.details?.cpu || "",
        memory: products.product.details?.memory || "",
        ram: products.product.details?.ram || "",
        battery: products.product.details?.battery || "",
        camera: products.product.details?.camera || "",
        os: products.product.details?.os || "",
        other_details: products.product.details?.other_details || "",
      })
      setAccessoryFields({
        dimensions: products.product.details?.dimensions || "",
        weight: products.product.details?.weight || "",
        other_details: products.product.details?.other_details || "",
      })
    }
  }, [products.product, products.isProductLoading, id.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues({
      ...formValues,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormValues({
        ...formValues,
        image: file,
      })
    }
  }

  const handleDetailChange = (e) => {
    const { name, value } = e.target
    if (type === "phone") {
      setPhoneFields({ ...phoneFields, [name]: value })
    } else {
      setAccessoryFields({ ...accessoryFields, [name]: value })
    }
  }

  const fetchImageAsFile = async (url) => {
    const response = await fetch(url)
    const blob = await response.blob()
    const file = new File([blob], "originalImage.jpg", { type: blob.type })
    return file
  }

  const updateProduct = async () => {
    setIsLoading(true)
    let updatedFormValues = { ...formValues }
    if (!formValues.image) {
      const originalImageFile = await fetchImageAsFile(products.product.image)
      if (originalImageFile) {
        updatedFormValues = {
          ...updatedFormValues,
          image: originalImageFile,
        }
      }
    }
    const details = type === "phone" ? phoneFields : accessoryFields
    const updatePayload = { ...updatedFormValues, type, ...details }

    try {
      await dispatch(editProduct(updatePayload))
      router.push(`/products/details/${products.product.id}`)
    } catch (error) {
      console.error("Failed to update product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const cancel = () => {
    router.push(`/products/details/${id.id}`)
  }

  if (products.isProductLoading || !products.product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/products/details/${id.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Product
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            {type === "phone" ? (
              <Smartphone className="h-8 w-8 text-blue-600" />
            ) : (
              <Headphones className="h-8 w-8 text-purple-600" />
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Update product information and specifications</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Product Image */}
            <Card>
              <CardHeader>
                <CardTitle>Current Product Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={products.product.image || "/placeholder.svg"}
                    alt={products.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Edit Form */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Update the basic product details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formValues.brand}
                      onChange={handleChange}
                      placeholder="e.g., Apple, Samsung"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formValues.name}
                      onChange={handleChange}
                      placeholder="e.g., iPhone 15 Pro"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      type="number"
                      id="price"
                      name="price"
                      value={formValues.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="image">Update Product Image</Label>
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4 text-gray-400" />
                      <Input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="h-10"
                      />
                    </div>
                    <p className="text-sm text-gray-500">Leave empty to keep current image</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Specifications */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
              <CardDescription>Update detailed product specifications</CardDescription>
            </CardHeader>
            <CardContent>
              {type === "phone" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dimensions</Label>
                    <Input
                      type="text"
                      name="dimensions"
                      placeholder="e.g., 146.7 x 71.5 x 7.8 mm"
                      value={phoneFields.dimensions}
                      onChange={handleDetailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight</Label>
                    <Input
                      type="text"
                      name="weight"
                      placeholder="e.g., 188g"
                      value={phoneFields.weight}
                      onChange={handleDetailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CPU</Label>
                    <Input
                      type="text"
                      name="cpu"
                      placeholder="e.g., A17 Pro chip"
                      value={phoneFields.cpu}
                      onChange={handleDetailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Storage</Label>
                    <Input
                      type="text"
                      name="memory"
                      placeholder="e.g., 128GB, 256GB"
                      value={phoneFields.memory}
                      onChange={handleDetailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>RAM</Label>
                    <Input
                      type="text"
                      name="ram"
                      placeholder="e.g., 8GB"
                      value={phoneFields.ram}
                      onChange={handleDetailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Battery</Label>
                    <Input
                      type="text"
                      name="battery"
                      placeholder="e.g., 3274 mAh"
                      value={phoneFields.battery}
                      onChange={handleDetailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Camera</Label>
                    <Input
                      type="text"
                      name="camera"
                      placeholder="e.g., 48MP Main + 12MP Ultra Wide"
                      value={phoneFields.camera}
                      onChange={handleDetailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Operating System</Label>
                    <Input
                      type="text"
                      name="os"
                      placeholder="e.g., iOS 17"
                      value={phoneFields.os}
                      onChange={handleDetailChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Additional Details</Label>
                    <Textarea
                      name="other_details"
                      placeholder="Any other important specifications"
                      value={phoneFields.other_details}
                      onChange={handleDetailChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dimensions</Label>
                    <Input
                      type="text"
                      name="dimensions"
                      placeholder="e.g., 190 x 160 x 78 mm"
                      value={accessoryFields.dimensions}
                      onChange={handleDetailChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight</Label>
                    <Input
                      type="text"
                      name="weight"
                      placeholder="e.g., 250g"
                      value={accessoryFields.weight}
                      onChange={handleDetailChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Additional Details</Label>
                    <Textarea
                      name="other_details"
                      placeholder="Describe features, compatibility, etc."
                      value={accessoryFields.other_details}
                      onChange={handleDetailChange}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button variant="outline" onClick={cancel} className="bg-transparent">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={updateProduct} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
