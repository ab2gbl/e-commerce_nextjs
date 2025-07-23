"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "@/redux/slices/productsSlice";

// Helper component to lookup product details
export function useProductLookup() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, products]);

  const getProductById = (id) => {
    return products?.find((product) => product.id === id) || null;
  };

  const getProductName = (id) => {
    const product = getProductById(id);
    return product ? `${product.brand} ${product.name}` : `Product #${id}`;
  };

  return { getProductById, getProductName, products };
}
