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

    // Dispatch the action with the updated form values
    dispatch(editProduct(updatedFormValues));
    router.push(`/products/details/` + products.product.id);
  };

  return (
    <div className="container mx-auto p-4">
      {products.isProductLoading || !products.product ? (
        <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
      ) : (
        <div className="flex">
          <div className="w-1/2 pr-8">
            <img
              src={products.product.image}
              alt={products.product.name}
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="name">Name:</label>
            <input
              className="mb-4"
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
            />
            <br />
            <label htmlFor="brand">Brand: </label>
            <input
              className="mb-4"
              type="text"
              id="brand"
              name="brand"
              value={formValues.brand}
              onChange={handleChange}
            />

            <br />
            <label htmlFor="price">Price: </label>
            <input
              className="mb-4"
              type="number"
              name="price"
              id="price"
              value={formValues.price}
              onChange={handleChange}
            />
            <br />
            <label htmlFor="image">Image: </label>
            <input
              className="mb-4"
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* Display the original image */}
            {formValues.imageUrl && (
              <div>
                <p>Current Image:</p>
                <img
                  src={formValues.imageUrl}
                  alt="Current product"
                  width="100"
                />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold mb-2">Details</h2>
              <ul className="list-disc ml-4">
                <li>Dimensions: {products.product.details.dimensions}</li>
                <li>Weight: {products.product.details.weight}</li>
                <li>CPU: {products.product.details.cpu}</li>
                <li>Memory: {products.product.details.memory}</li>
                <li>RAM: {products.product.details.ram}</li>
                <li>Battery: {products.product.details.battery}</li>
                <li>Camera: {products.product.details.camera}</li>
                <li>OS: {products.product.details.os}</li>
                <li>Other Details: {products.product.details.other_details}</li>
              </ul>
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              onClick={updateProduct}
            >
              Update Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
