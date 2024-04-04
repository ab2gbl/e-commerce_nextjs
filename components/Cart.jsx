'use client'
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { updateCount,removeProduct } from "@/redux/slices/cartSlice";

export default function Cart() {
    
    const cart = useSelector((state) => state.cart);
    const [product, setProduct] = useState({});
    const dispatch = useDispatch();

    const updateProductCount = (productId, newQuantity) => {
        dispatch(updateCount({ productId, newQuantity }));
    };
    const remove= (productId) =>{
      dispatch(removeProduct(productId));
    }
    return (
      <div className="grid grid-cols-1 gap-4">
          {/* Render cart */}
          {cart.products.map((obj) => {
              return (

                <div className="bg-white p-4 shadow-md rounded-md grid grid-cols-12">
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
                      <input type="number" min="0" defaultValue={obj.count} onChange={(event) => updateProductCount(obj.product.id, parseInt(event.target.value))} />
                      <Link className="cursor-pointer" key={obj.product.id} href={`/products/${obj.product.id}`}><p>show product</p></Link>
                      <button 
                        className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        onClick={remove}
                      >remove</button>
                  </div>
                </div>
            
                  
              );
          })}
      </div>
  );
  
}