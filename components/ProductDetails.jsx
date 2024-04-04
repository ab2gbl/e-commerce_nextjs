'use client'
import { useEffect, useState } from 'react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct } from "@/redux/slices/productsSlice";
import { addProduct } from "@/redux/slices/cartSlice";

export default function ProductDetails({ id }) {
    const products = useSelector(state => state.products)
    const [dis,setdis]=useState(false);
    const [count,setcount]=useState(1);
    const dispatch=useDispatch()
    useEffect(  () => {
        dispatch(getProduct(id))
    },[])

    function add(){
      if(count>0)
        dispatch(addProduct({count: count,product: products.product}))
    } 
    function display(){
      setdis(true)
    } 
    
    return (
  <div className="container mx-auto p-4">
    {products.isProductLoading ? (
      <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
    ) : (
      <div className="flex">
        {/* Product Image */}
        <div className="w-1/2 pr-8">
          <img
            src={products.product.image}
            alt={products.product.name}
            className="w-full h-auto rounded-md"
          />
        </div>
        {/* Product Details */}
        <div className="w-1/2">
          <h1 className="text-3xl font-semibold mb-4">{products.product.name}</h1>
          <p className="text-xl mb-2">{products.product.brand}</p>
          <p className="text-lg mb-2">Type: {products.product.type}</p>
          <p className="text-lg mb-2">Price: ${products.product.price}</p>
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
            className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            onClick={display}
          >add to cart</button>

          <div>
            {dis}
          {dis ? (
            <from>
              <input type="number" name="count" id="" defaultValue={1}
                onChange={(event) => {
                  const newValue = parseInt(event.target.value, 10);
                  setcount(newValue >= 0 ? newValue : 0);
                }}
                />
              <input type="submit" 
                className='cursor-pointer rounded-md bg-yellow-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                value="add"
                onClick={add}
              />
            </from>
          ):(<div></div>)}
          </div>
        </div>
      </div>
    )}
  </div>
);

}
