"use client";
import { useEffect, useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeProduct } from "@/redux/slices/productsSlice";
import { addProduct } from "@/redux/slices/cartSlice";
import { initAuth } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function ProductDetails({ id }) {
  const router = useRouter();
  const products = useSelector((state) => state.products);
  const role = useSelector((state) => state.user.role);
  const isLog = useSelector((state) => state.user.isLog);

  const [dis, setdis] = useState(false);
  const [count, setCount] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProduct(id));
    if (!isLog) {
      initAuth();
    }
    // eslint-disable-next-line
  }, [id]);

  function add() {
    if (count > 0) {
      dispatch(addProduct({ count: count, product: products.product }));
      toast((t) => (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">Added to cart!</span>
          </div>
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
              onClick={() => {
                toast.dismiss(t.id);
                router.push("/cart");
              }}
            >
              Go to Cart
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
              onClick={() => {
                toast.dismiss(t.id);
                router.push("/");
              }}
            >
              Go Home
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm font-medium transition duration-200"
              onClick={() => toast.dismiss(t.id)}
            >
              Stay
            </button>
          </div>
        </div>
      ), { 
        duration: 6000,
        style: {
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          minWidth: '280px'
        }
      });
    }
  }
  function display() {
    setdis(true);
  }

  if (products.isProductLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  if (!products.product || !products.product.id) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500 text-lg">Product not found.</p>
      </div>
    );
  }

  const maxQty = products.product?.in_stock || 1;
  const isOutOfStock = products.product?.in_stock === 0;

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Product Image */}
        <div className="md:w-1/2 w-full flex justify-center items-center bg-gray-100 p-8">
            <img
              src={products.product.image}
              alt={products.product.name}
            className="w-full max-w-xs h-auto rounded-md object-cover shadow-md"
            />
          </div>
          {/* Product Details */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-between">
            <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{products.product.name}</h1>
            <p className="text-xl mb-2 text-gray-600">{products.product.brand}</p>
            <p className="text-lg mb-2 text-gray-700">Type: <span className="capitalize">{products.product.type}</span></p>
            <p className="text-lg mb-2 text-blue-600 font-bold">Price: ${products.product.price}</p>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Details</h2>
              <ul className="list-disc ml-4 text-gray-700 space-y-1">
                {products.product.type === 'phone' ? (
                  <>
                    <li>Dimensions: {products.product.details?.dimensions || '-'}</li>
                    <li>Weight: {products.product.details?.weight || '-'}</li>
                    <li>CPU: {products.product.details?.cpu || '-'}</li>
                    <li>Memory: {products.product.details?.memory || '-'}</li>
                    <li>RAM: {products.product.details?.ram || '-'}</li>
                    <li>Battery: {products.product.details?.battery || '-'}</li>
                    <li>Camera: {products.product.details?.camera || '-'}</li>
                    <li>OS: {products.product.details?.os || '-'}</li>
                    <li>Other Details: {products.product.details?.other_details || '-'}</li>
                  </>
                ) : (
                  <>
                    <li>Dimensions: {products.product.details?.dimensions || '-'}</li>
                    <li>Weight: {products.product.details?.weight || '-'}</li>
                    <li>Other Details: {products.product.details?.other_details || '-'}</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {!isOutOfStock ? (
              <>
            <button
                  className="rounded-md bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              onClick={display}
            >
                  Add to cart
                </button>
                {dis && (
                  <form className="flex items-center gap-2 mt-2" onSubmit={e => { e.preventDefault(); add(); }}>
                    <input
                      type="number"
                      name="count"
                      min={1}
                      max={maxQty}
                      value={count}
                      onChange={(event) => {
                        let newValue = parseInt(event.target.value, 10);
                        if (newValue > maxQty) newValue = maxQty;
                        if (newValue < 1) newValue = 1;
                        setCount(newValue);
                      }}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                      disabled={count > maxQty || count < 1}
                    >
                      Add
            </button>
                    {count > maxQty && (
                      <span className="text-red-500 text-sm ml-2">Only {maxQty} in stock</span>
                    )}
                  </form>
                )}
              </>
            ) : (
              <span className="text-red-500 text-lg font-semibold">Out of stock</span>
            )}
            {role === "ADMIN" && (
              <div className="flex gap-2 mt-2">
                <button
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                  onClick={() => {
                    dispatch(removeProduct(id.id));
                    router.push("/");
                  }}
                >
                  Delete
                </button>
                <Link href={`/products/edit/${id.id}`}>
                  <button className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2">
                    Edit
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
