"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "@/redux/slices/productsSlice";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Smartphone,
  Headphones,
  Search,
  Filter,
  Star,
  Package,
  Loader2,
} from "lucide-react";

const ProductsHome = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
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
    setSidebarOpen(false);
  };

  const filterOptions = [
    { value: "all", label: "All Products", icon: Package },
    { value: "phone", label: "Phones", icon: Smartphone },
    { value: "accessory", label: "Accessories", icon: Headphones },
  ];

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={filterType === option.value ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleFilter(option.value)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Latest Phones & Accessories
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover the newest technology at unbeatable prices
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Free Shipping
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                1 Year Warranty
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                24/7 Support
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-1/4">
            <Card className="p-6 sticky top-24">
              <FilterSidebar />
            </Card>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="mb-6 bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {filterType === "all"
                  ? "All Products"
                  : filterType === "phone"
                  ? "Phones"
                  : "Accessories"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredProducts.length} products found
              </p>
            </div>

            {products.isProductsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/details/${product.id}`}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge
                              variant={
                                product.available ? "default" : "destructive"
                              }
                            >
                              {product.available ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </div>
                          {product.type === "phone" && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary">
                                <Smartphone className="h-3 w-3 mr-1" />
                                Phone
                              </Badge>
                            </div>
                          )}
                          {product.type === "accessory" && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary">
                                <Headphones className="h-3 w-3 mr-1" />
                                Accessory
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                            {product.brand} {product.name}
                          </h3>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">
                              (4.5)
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-blue-600">
                              ${product.price}
                            </p>
                            <p className="text-sm text-gray-500">
                              Stock: {product.in_stock}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsHome;
