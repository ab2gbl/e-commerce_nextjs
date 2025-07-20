"use client";
import { useEffect, useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, editProduct } from "@/redux/slices/productsSlice";
import { useRouter } from "next/navigation";

export default function ProductEditComp({ id }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const products = useSelector((state) => state.products);

  const [formValues, setFormValues] = useState({
    id: id.id,
    brand: "",
    name: "",
    price: "",
    imageUrl: "", // URL of the original image
    image: null,
  });
  const [type, setType] = useState('');
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

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (products.product && !products.isProductLoading) {
      setFormValues({
        id: id.id,
        brand: products.product.brand || "",
        name: products.product.name || "",
        price: products.product.price || "",
        imageUrl: products.product.image || "",
        image: null,
      });
      setType(products.product.type || '');
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
      });
      setAccessoryFields({
        dimensions: products.product.details?.dimensions || "",
        weight: products.product.details?.weight || "",
        other_details: products.product.details?.other_details || "",
      });
    }
  }, [products.product, products.isProductLoading, id.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues({
        ...formValues,
        image: file,
      });
    }
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    if (type === 'phone') {
      setPhoneFields({ ...phoneFields, [name]: value });
    } else {
      setAccessoryFields({ ...accessoryFields, [name]: value });
    }
  };

  const fetchImageAsFile = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], "originalImage.jpg", { type: blob.type });
    return file;
  };

  const updateProduct = async () => {
    let updatedFormValues = { ...formValues };
    if (!formValues.image) {
      const originalImageFile = await fetchImageAsFile(products.product.image);
      if (originalImageFile) {
        updatedFormValues = {
          ...updatedFormValues,
          image: originalImageFile,
        };
      }
    }
    // Add details fields flat
    const details = type === 'phone' ? phoneFields : accessoryFields;
    const updatePayload = { ...updatedFormValues, type, ...details };
    dispatch(editProduct(updatePayload));
    router.push(`/products/details/` + products.product.id);
  };
  const cancel = () => {
    router.push(`/products/details/` + id.id);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-8">
      {products.isProductLoading || !products.product ? (
        <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
      ) : (
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2 w-full flex flex-col items-center justify-center">
            <img
              src={products.product.image}
              alt={products.product.name}
              className="w-full max-w-xs h-auto rounded-md object-cover shadow-md mb-4"
            />
            {formValues.imageUrl && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Current Image</p>
                <img
                  src={formValues.imageUrl}
                  alt="Current product"
                  className="w-24 h-24 object-cover rounded-md mx-auto"
                />
              </div>
            )}
          </div>
          {/* Product Edit Form */}
          <div className="md:w-1/2 w-full">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  type="text"
                  id="brand"
                  name="brand"
                  value={formValues.brand}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  type="number"
                  name="price"
                  id="price"
                  value={formValues.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Details</h2>
                {type === 'phone' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="dimensions" placeholder="Dimensions" value={phoneFields.dimensions} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" name="weight" placeholder="Weight" value={phoneFields.weight} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" name="cpu" placeholder="CPU" value={phoneFields.cpu} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" name="memory" placeholder="Memory" value={phoneFields.memory} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" name="ram" placeholder="RAM" value={phoneFields.ram} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" name="battery" placeholder="Battery" value={phoneFields.battery} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" name="camera" placeholder="Camera" value={phoneFields.camera} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" name="os" placeholder="OS" value={phoneFields.os} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" name="other_details" placeholder="Other Details" value={phoneFields.other_details} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="dimensions" placeholder="Dimensions" value={accessoryFields.dimensions} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" name="weight" placeholder="Weight" value={accessoryFields.weight} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" name="other_details" placeholder="Other Details" value={accessoryFields.other_details} onChange={handleDetailChange} className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" />
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                  onClick={updateProduct}
                >
                  Update Product
                </button>
                <button
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                  onClick={cancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
