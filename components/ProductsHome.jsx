// pages/products/index.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "@/redux/slices/productsSlice";
import Link from "next/link";

const ProductsHome = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterType, setFilterType] = useState("all"); // Default to show all products
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  // Fetch products every time component mounts
  useEffect(() => {
      dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    // Filter products based on the selected filter type and search term
    let filtered = products.products || [];

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto flex flex-col md:flex-row p-4 gap-4">
      {/* Sidebar */}
        <div className={`md:w-1/4 w-full md:pr-4 mb-4 md:mb-0 ${sidebarOpen ? "" : "hidden md:block"}`}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4 md:hidden">
              <h1 className="text-2xl font-semibold">Filters</h1>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-blue-600">✕</button>
            </div>
            <div className="hidden md:block mb-4">
        <h1 className="text-2xl font-semibold mb-4">Filters</h1>
            </div>
        {/* Filter buttons */}
            <div className="mb-4 space-y-2">
          <button
                className={`w-full py-2 rounded-md ${filterType === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => handleFilter("all")}
          >
            All
          </button>
          <button
                className={`w-full py-2 rounded-md ${filterType === "phone" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => handleFilter("phone")}
          >
            Phones
          </button>
          <button
                className={`w-full py-2 rounded-md ${filterType === "accessory" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
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
        </div>
        {/* Sidebar toggle for mobile */}
        <button
          className="md:hidden mb-4 bg-blue-500 text-white px-4 py-2 rounded-md self-start"
          onClick={() => setSidebarOpen(true)}
        >
          Filters
        </button>
      {/* Products */}
        <div className="md:w-3/4 w-full">
          <h1 className="text-3xl font-semibold mb-4 text-gray-800">Products</h1>
        {products.isProductsLoading ? (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/details/${product.id}`}>
                  <div className="bg-white p-4 shadow-lg rounded-lg cursor-pointer hover:shadow-xl transition duration-200 flex flex-col h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                      className="w-full h-40 object-cover mb-4 rounded-md"
                  />
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">{`${product.brand} ${product.name}`}</h2>
                    <p className="text-gray-600 capitalize">{product.type}</p>
                    <p className="text-gray-700 mt-2 font-bold">${product.price}</p>
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
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default ProductsHome;
