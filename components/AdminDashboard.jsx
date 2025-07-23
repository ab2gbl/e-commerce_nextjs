"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "@/redux/slices/productsSlice";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Package,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Smartphone,
  Headphones,
  AlertCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalPhones: 0,
    totalAccessories: 0,
    lowStockItems: 0,
    totalValue: 0,
  });

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  // In your seller dashboard component
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("success") === "product-created") {
      toast.success("Product created successfully!", {
        duration: 4000,
        position: "top-center",
      });
      // Clean up URL
      router.replace("/seller");
    }
  }, []);
  useEffect(() => {
    if (products.products) {
      const totalProducts = products.products.length;
      const totalPhones = products.products.filter(
        (p) => p.type === "phone"
      ).length;
      const totalAccessories = products.products.filter(
        (p) => p.type === "accessory"
      ).length;
      const lowStockItems = products.products.filter(
        (p) => p.in_stock < 5
      ).length;
      const totalValue = products.products.reduce(
        (sum, p) => sum + p.price * p.in_stock,
        0
      );

      setStats({
        totalProducts,
        totalPhones,
        totalAccessories,
        lowStockItems,
        totalValue,
      });
    }
  }, [products.products]);

  const chartData = [
    { name: "Phones", value: stats.totalPhones, color: "#3b82f6" },
    { name: "Accessories", value: stats.totalAccessories, color: "#8b5cf6" },
  ];

  const stockData =
    products.products?.map((product) => ({
      name: `${product.brand} ${product.name}`.substring(0, 15) + "...",
      stock: product.in_stock,
      price: product.price,
    })) || [];

  const quickActions = [
    {
      title: "Add New Product",
      description: "Create a new phone or accessory listing",
      href: "/seller/newproduct",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Manage Bills",
      description: "View and manage customer orders",
      href: "/seller/bills",
      icon: ShoppingCart,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Add Admin",
      description: "Create new admin accounts",
      href: "/seller/newadmin",
      icon: Users,
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Toaster />

      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                Admin Dashboard
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                Manage your phone store inventory and operations
              </p>
            </div>
            <Button asChild size="sm" className="flex-shrink-0">
              <Link href="/seller/newproduct">
                <Plus className="h-4 w-4 mr-1 md:mr-2" />
                <span className="text-xs md:text-sm">Add</span>
                <span className="hidden md:inline ml-1">Product</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total stock value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Items
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.lowStockItems}
              </div>
              <p className="text-xs text-muted-foreground">
                Items below 5 units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  <Smartphone className="h-3 w-3 mr-1" />
                  {stats.totalPhones} Phones
                </Badge>
                <Badge variant="secondary">
                  <Headphones className="h-3 w-3 mr-1" />
                  {stats.totalAccessories} Accessories
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.title}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <Link href={action.href}>
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Product Distribution</CardTitle>
              <CardDescription>Breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {chartData.map((entry) => (
                  <div key={entry.name} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stock Levels */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Levels</CardTitle>
              <CardDescription>Current inventory by product</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products */}
        {/* Recent Products */}
        {/* Recent Products - Low Stock Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>
              Products that need restocking (ordered by lowest stock)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.products
                ? [...products.products] // Create a copy of the array first
                    .sort((a, b) => a.in_stock - b.in_stock) // Sort by stock ascending (lowest first)
                    .slice(0, 5)
                    .map((product) => (
                      <div key={product.id} className="p-4 border rounded-lg">
                        {/* Mobile Layout */}
                        <div className="flex sm:hidden items-start space-x-4">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">
                              {product.brand} {product.name}
                            </h3>
                            <p className="text-xs text-gray-500 capitalize mb-2">
                              {product.type}
                            </p>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-sm">
                                  ${product.price}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <p className="text-xs text-gray-500">
                                    Stock: {product.in_stock}
                                  </p>
                                  {product.in_stock < 5 && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Low Stock
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/products/details/${product.id}`}>
                                  View
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:grid sm:grid-cols-12 items-center gap-4">
                          {/* Product Image and Info */}
                          <div className="col-span-6 flex items-center space-x-4">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold truncate">
                                {product.brand} {product.name}
                              </h3>
                              <p className="text-sm text-gray-500 capitalize">
                                {product.type}
                              </p>
                            </div>
                          </div>

                          {/* Price and Stock */}
                          <div className="col-span-4 text-right">
                            <p className="font-semibold">${product.price}</p>
                            <div className="flex items-center justify-end space-x-2">
                              <p className="text-sm text-gray-500">
                                Stock: {product.in_stock}
                              </p>
                              {product.in_stock === 0 ? (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Out of Stock
                                </Badge>
                              ) : product.in_stock < 5 ? (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Low Stock
                                </Badge>
                              ) : null}
                            </div>
                          </div>

                          {/* Button */}
                          <div className="col-span-2 flex justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/products/details/${product.id}`}>
                                View
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                : null}

              {/* Show message if no products */}
              {(!products.products || products.products.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No products found
                </div>
              )}
            </div>

            {/* Link to view all products */}
            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <Link href="/client">View All Products</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
