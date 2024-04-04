'use client';
import { useEffect } from "react";

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from "@/redux/slices/productsSlice";

function DjangoApi(){
    //const {countState}=useSelector(state => state.counter.products)
    const products = useSelector(state => state.products)
    const dispatch=useDispatch()
    useEffect(  () => {
        dispatch(getProducts())
    },[])
    
    return (
        
        <div>
            {
                
                products.isLoading? <h1> Loading ... </h1>:
                products.products.map(product=>{
                    return (
                        <div> 
                            <h2>{product.brand} {product.name}</h2>
                            
                        </div>
                        )
                })
            }
        </div>
    )
}
export default DjangoApi


