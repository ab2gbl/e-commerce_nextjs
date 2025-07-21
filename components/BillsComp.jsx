"use client";
import { useDispatch, useSelector } from "react-redux";
import { getBills } from "@/redux/slices/billsSlice";
import { useEffect, useState, useMemo } from "react";
import api from "@/utils/api";
import withRole from "@/utils/withRole";

export default function BillsComp() {
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills.bills);
  const isLoading = useSelector((state) => state.bills.isProductsLoading);
  const error = useSelector((state) => state.bills.error);
  
  // Filter states
  const [filterType, setFilterType] = useState("all");
  const [searchProduct, setSearchProduct] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  
  // Sort states
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    dispatch(getBills());
  }, [dispatch]);

  // Filter and sort bills
  const filteredAndSortedBills = useMemo(() => {
    let filtered = bills;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(bill => {
        if (filterType === "sale") {
          return !!bill.user;
        }
        if (filterType === "buy" || filterType === "sell") {
          return bill.type === filterType && !bill.user;
        }
        return true;
      });
    }

    // Filter by user search
    if (searchUser.trim()) {
      filtered = filtered.filter(bill =>
        bill.user && bill.user.toLowerCase().includes(searchUser.toLowerCase())
      );
    }

    // Filter by product search
    if (searchProduct.trim()) {
      filtered = filtered.filter(bill => 
        bill.products_details?.some(productDetail => 
          `${productDetail.product.brand} ${productDetail.product.name}`
            .toLowerCase()
            .includes(searchProduct.toLowerCase())
        )
      );
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(bill => new Date(bill.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(bill => new Date(bill.date) <= new Date(dateTo));
    }

    // Filter by price range
    if (priceFrom) {
      filtered = filtered.filter(bill => parseFloat(bill.price) >= parseFloat(priceFrom));
    }
    if (priceTo) {
      filtered = filtered.filter(bill => parseFloat(bill.price) <= parseFloat(priceTo));
    }

    // Create a new array and sort it
    const sortedBills = [...filtered].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "price":
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sortedBills;
  }, [bills, filterType, searchProduct, searchUser, dateFrom, dateTo, priceFrom, priceTo, sortBy, sortOrder]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeColor = (type, user) => {
    if (user) return 'bg-yellow-100 text-yellow-800';
    return type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const clearFilters = () => {
    setFilterType("all");
    setSearchProduct("");
    setSearchUser("");
    setDateFrom("");
    setDateTo("");
    setPriceFrom("");
    setPriceTo("");
  };

  const hasActiveFilters = filterType !== "all" || searchProduct || searchUser || dateFrom || dateTo || priceFrom || priceTo;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <p className="text-gray-600">Loading bills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600">Error loading bills. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bills Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage all bills in the system
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="date">Sort by Date</option>
                  <option value="id">Sort by ID</option>
                  <option value="price">Sort by Price</option>
                  <option value="type">Sort by Type</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="w-full flex flex-col md:flex-row md:flex-wrap gap-4">
              {/* Group 1: Type, Product, User */}
              <div className="flex flex-col md:flex-row gap-4 flex-1 min-w-[250px]">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Product</label>
                  <input
                    type="text"
                    placeholder="Product name..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search User</label>
                  <input
                    type="text"
                    placeholder="User name..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              {/* Group 2: Date and Price */}
              <div className="flex flex-col md:flex-row gap-4 flex-1 min-w-[250px]">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="flex-1 min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="flex-1 min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price From</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="flex-1 min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price To</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {filteredAndSortedBills.length} of {bills.length} bills match your filters
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Bills Table */}
          <div className="overflow-x-auto">
            {filteredAndSortedBills.length === 0 ? (
              <div className="text-center py-12">
                <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg">No bills found.</p>
                <p className="text-gray-400 text-sm mt-1">
                  {hasActiveFilters ? "Try adjusting your filters." : "No bills have been created yet."}
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{bill.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(bill.type, bill.user)}`}>
                          {bill.user ? "SALE" : bill.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(bill.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${parseFloat(bill.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="space-y-1">
                          {bill.products_details?.map((productDetail, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-700">
                                {productDetail.product.brand} {productDetail.product.name}
                              </span>
                              <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                                Qty: {productDetail.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.user ? bill.user : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Summary */}
          {filteredAndSortedBills.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                <span>Showing {filteredAndSortedBills.length} of {bills.length} bills</span>
                <span className="mt-2 sm:mt-0">
                  Total Value: ${filteredAndSortedBills.reduce((sum, bill) => sum + parseFloat(bill.price), 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MyPurchasesCompRaw() {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filter states
  const [searchProduct, setSearchProduct] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  // Sort states
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    setIsLoading(true);
    api.get("/product/mybills/")
      .then(res => setBills(res.data))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredAndSortedBills = useMemo(() => {
    let filtered = bills;
    if (searchProduct.trim()) {
      filtered = filtered.filter(bill =>
        bill.products_details?.some(productDetail =>
          `${productDetail.product.brand} ${productDetail.product.name}`
            .toLowerCase()
            .includes(searchProduct.toLowerCase())
        )
      );
    }
    if (dateFrom) {
      filtered = filtered.filter(bill => new Date(bill.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(bill => new Date(bill.date) <= new Date(dateTo));
    }
    if (priceFrom) {
      filtered = filtered.filter(bill => parseFloat(bill.price) >= parseFloat(priceFrom));
    }
    if (priceTo) {
      filtered = filtered.filter(bill => parseFloat(bill.price) <= parseFloat(priceTo));
    }
    const sortedBills = [...filtered].sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "price":
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return sortedBills;
  }, [bills, searchProduct, dateFrom, dateTo, priceFrom, priceTo, sortBy, sortOrder]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const getTypeColor = (type) => {
    return type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };
  const clearFilters = () => {
    setSearchProduct("");
    setDateFrom("");
    setDateTo("");
    setPriceFrom("");
    setPriceTo("");
  };
  const hasActiveFilters = searchProduct || dateFrom || dateTo || priceFrom || priceTo;
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <p className="text-gray-600">Loading your bills...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600">Error loading your bills. Please try again.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Buys</h1>
                <p className="mt-1 text-sm text-gray-500">
                  View all your bills and purchases
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="date">Sort by Date</option>
                  <option value="id">Sort by ID</option>
                  <option value="price">Sort by Price</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>
          {/* Filters */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="w-full flex flex-col md:flex-row md:flex-wrap gap-4">
              <div className="flex flex-col md:flex-row gap-4 flex-1 min-w-[250px]">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Product</label>
                  <input
                    type="text"
                    placeholder="Product name..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 flex-1 min-w-[250px]">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price From</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price To</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {filteredAndSortedBills.length} of {bills.length} bills match your filters
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
          {/* Bills Table */}
          <div className="overflow-x-auto">
            {filteredAndSortedBills.length === 0 ? (
              <div className="text-center py-12">
                <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg">No bills found.</p>
                <p className="text-gray-400 text-sm mt-1">
                  {hasActiveFilters ? "Try adjusting your filters." : "No bills have been created yet."}
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{bill.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(bill.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${parseFloat(bill.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="space-y-1">
                          {bill.products_details?.map((productDetail, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-700">
                                {productDetail.product.brand} {productDetail.product.name}
                              </span>
                              <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                                Qty: {productDetail.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Summary */}
          {filteredAndSortedBills.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                <span>Showing {filteredAndSortedBills.length} of {bills.length} bills</span>
                <span className="mt-2 sm:mt-0">
                  Total Value: ${filteredAndSortedBills.reduce((sum, bill) => sum + parseFloat(bill.price), 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const MyPurchasesComp = withRole(MyPurchasesCompRaw, ["ADMIN", "CLIENT"]);
