// Cart.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { updateCount, removeProduct } from "@/redux/slices/cartSlice";
import ProductPaypal from "@/components/ProductPaypal";
import PayAll from "./PayAll";

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const updateProductCount = (productId, newQuantity) => {
    dispatch(updateCount({ productId, newQuantity }));
  };

  const remove = (productId) => {
    dispatch(removeProduct(productId));
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Render cart */}
      {cart.products.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg className="h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.48 19h8.04a2 2 0 001.83-1.3L17 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
          </svg>
          <span className="text-lg font-semibold">Your cart is empty</span>
        </div>
      )}
      {cart.products.map((obj) => (
        <div className="bg-white p-4 shadow-md rounded-md grid grid-cols-12" key={obj.product.id}>
          <div className="col-span-2 max-h-48 flex justify-center items-center">
            <img
              src={obj.product.image}
              alt={obj.product.name}
              className="object-cover rounded-md"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>

          <div className="col-span-2 ml-5">
            <h2 className="text-lg font-semibold text-gray-900">{`${obj.product.brand} ${obj.product.name}`}</h2>
            <p className="text-gray-600">{obj.product.type}</p>
            <p className="text-gray-700 mt-2">${obj.product.price}</p>
            <p className="text-sm text-gray-500 mt-2">
              In Stock: {obj.product.in_stock} | {obj.product.available ? "Available" : "Out of Stock"}
            </p>
            <input
              type="number"
              min="0"
              defaultValue={obj.count}
              onChange={(event) => {
                updateProductCount(obj.product.id, parseInt(event.target.value))
              }}
            />
            <Link className="cursor-pointer" key={obj.product.id} href={`/products/${obj.product.id}`}>
              <p>Show product</p>
            </Link>
            <button
              className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              onClick={() => remove(obj.product.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      {/* Checkout button and modal */}
      {cart.products.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-200"
            onClick={() => setShowModal(true)}
          >
            Checkout
          </button>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>
            <PayAll onPaymentSuccess={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
