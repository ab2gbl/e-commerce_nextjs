// pages/products/index.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "@/redux/slices/productsSlice";
import Link from "next/link";

const ProductsHome = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterType, setFilterType] = useState("all"); // Default to show all products
  const [searchTerm, setSearchTerm] = useState("");
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  useEffect(() => {
    // Filter products based on the selected filter type and search term
    let filtered = products.products;

    if (filterType !== "all") {
      filtered = filtered.filter((product) => product.type === filterType);
    }

    if (searchTerm.trim() !== "") {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.brand.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    setFilteredProducts(filtered);
  }, [products.products, filterType, searchTerm]);

  const handleFilter = (type) => {
    setFilterType(type);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto flex p-4">
      {/* Sidebar */}
      <div className="w-1/4 pr-4">
        <h1 className="text-2xl font-semibold mb-4">Filters</h1>

        {/* Filter buttons */}
        <div className="mb-4">
          <button
            className={`mb-2 w-full ${filterType === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleFilter("all")}
          >
            All
          </button>
          <button
            className={`mb-2 w-full ${filterType === "phone" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleFilter("phone")}
          >
            Phones
          </button>
          <button
            className={`mb-2 w-full ${filterType === "accessory" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleFilter("accessory")}
          >
            Accessories
          </button>
        </div>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Products */}
      <div className="w-3/4">
        <h1 className="text-3xl font-semibold mb-4">Products</h1>

        {products.isProductsLoading ? (
          <h1>Loading...</h1>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
              <div className="bg-white p-4 shadow-md rounded-md cursor-pointer">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover mb-4 rounded-md"
                />
                <h2 className="text-lg font-semibold text-gray-900">{`${product.brand} ${product.name}`}</h2>
                <p className="text-gray-600">{product.type}</p>
                <p className="text-gray-700 mt-2">${product.price}</p>
                <p className="text-sm text-gray-500 mt-2">
                  In Stock: {product.in_stock} | {product.available ? "Available" : "Out of Stock"}
                </p>
              </div>
            </Link>
            
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsHome;
