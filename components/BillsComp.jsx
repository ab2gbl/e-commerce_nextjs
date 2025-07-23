"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBills, getUserBills } from "@/redux/slices/billsSlice";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Search,
  Plus,
  ArrowLeft,
  Calendar,
  Download,
  ShoppingBag,
  Package,
  Loader2,
} from "lucide-react";
import { useProductLookup } from "./ProductLookup";

export function BillsComp() {
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const { getProductName } = useProductLookup();

  useEffect(() => {
    dispatch(getBills());
  }, [dispatch]);

  useEffect(() => {
    if (bills.bills) {
      let filtered = [...bills.bills];

      // Apply type filter
      if (filterType !== "all") {
        filtered = filtered.filter((bill) => {
          if (filterType === "user_sale") {
            // Filter for sales that have a user (orders from users)
            return bill.type === "sell" && bill.user != null;
          } else if (filterType === "sell") {
            // Filter for admin-created sales (bills without user)
            return bill.type === "sell" && bill.user == null;
          } else {
            return bill.type === filterType;
          }
        });
      }

      // Apply search filter
      if (searchTerm.trim() !== "") {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter((bill) => {
          return (
            bill.id.toString().includes(lowerCaseSearchTerm) ||
            bill.date.toLowerCase().includes(lowerCaseSearchTerm) ||
            bill.price.toString().includes(lowerCaseSearchTerm) ||
            bill.type.toLowerCase().includes(lowerCaseSearchTerm) ||
            bill.user?.toLowerCase().includes(lowerCaseSearchTerm) ||
            bill.products_details?.some((item) =>
              getProductName(item.product.id)
                .toLowerCase()
                .includes(lowerCaseSearchTerm)
            )
          );
        });
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "date-asc":
            return new Date(a.date) - new Date(b.date);
          case "date-desc":
            return new Date(b.date) - new Date(a.date);
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          default:
            return new Date(b.date) - new Date(a.date);
        }
      });

      setFilteredBills(filtered);
    }
  }, [bills.bills, searchTerm, filterType, sortBy]);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getProductDetails = (productId) => {
    // This would ideally come from a products lookup, but for now we'll show the ID
    return `Product #${productId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/seller">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Bills Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:hidden">
                  Manage transactions
                </p>
              </div>
            </div>

            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href="/seller/newbill">
                <Plus className="h-4 w-4 mr-2" />
                <span className="sm:hidden">New Bill</span>
                <span className="hidden sm:inline">Create New Bill</span>
              </Link>
            </Button>
          </div>

          <p className="hidden sm:block text-gray-600 dark:text-gray-400 mt-2">
            View and manage all purchase and sales transactions
          </p>
        </div>
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by ID, date: 2025-01-01, product, client or price,..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="buy">Purchases</SelectItem>
                    <SelectItem value="sell">Sales</SelectItem>
                    <SelectItem value="user_sale">User Orders</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort by</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">
                      Date (Newest First)
                    </SelectItem>
                    <SelectItem value="date-asc">
                      Date (Oldest First)
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price (High to Low)
                    </SelectItem>
                    <SelectItem value="price-asc">
                      Price (Low to High)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bills Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Records</CardTitle>
            <CardDescription>
              {filteredBills.length}{" "}
              {filteredBills.length === 1 ? "record" : "records"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bills.isBillsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredBills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No bills found.</p>
              </div>
            ) : (
              <>
                {/* Mobile Layout - Card Based */}
                <div className="lg:hidden space-y-4">
                  {filteredBills.map((bill) => (
                    <Card key={bill.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        {/* Header */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-3">
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="bg-white">
                              #{bill.id}
                            </Badge>
                            <Badge
                              variant={
                                bill.type === "sell"
                                  ? bill.user != null
                                    ? "default"
                                    : "outline"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {bill.type === "sell" ? (
                                <>
                                  <ShoppingBag className="h-3 w-3 mr-1" />
                                  {bill.user != null
                                    ? "User Order"
                                    : "Admin Sale"}
                                </>
                              ) : (
                                <>
                                  <Package className="h-3 w-3 mr-1" />
                                  Purchase
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(bill.date)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 space-y-3">
                          {/* Products */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-2">
                              PRODUCTS
                            </h4>
                            <div className="space-y-1">
                              {bill.products_details?.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="font-medium">
                                    {getProductName(item.product.id)}
                                  </span>
                                  <span className="text-gray-500">
                                    × {item.quantity}
                                  </span>
                                </div>
                              )) || (
                                <span className="text-gray-400 text-sm">
                                  No items
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Amount and Client */}
                          <div className="flex justify-between items-center pt-2 border-t">
                            <div>
                              <p className="text-xs text-gray-500">CLIENT</p>
                              <p className="font-semibold">{bill.user}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">AMOUNT</p>
                              <p className="text-lg font-bold text-blue-600">
                                ${Number.parseFloat(bill.price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop Layout - Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Client</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell className="font-medium">
                            #{bill.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {formatDate(bill.date)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                bill.type === "sell"
                                  ? bill.user != null
                                    ? "default"
                                    : "outline"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {bill.type === "sell" ? (
                                <>
                                  <ShoppingBag className="h-3 w-3 mr-1" />
                                  {bill.user != null
                                    ? "User Order"
                                    : "Admin Sale"}
                                </>
                              ) : (
                                <>
                                  <Package className="h-3 w-3 mr-1" />
                                  Purchase
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {bill.products_details?.map((item, index) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium">
                                    {getProductName(item.product.id)}
                                  </span>
                                  <span className="text-gray-500 ml-2">
                                    × {item.quantity}
                                  </span>
                                </div>
                              )) || (
                                <span className="text-gray-400">No items</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${Number.parseFloat(bill.price).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <b>{bill.user}</b>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {searchTerm.trim() !== "" || filterType !== "all" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Filtered Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredBills?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {filterType === "all"
                    ? "All records"
                    : filterType === "buy"
                    ? "Purchase records"
                    : "Sales records"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  $
                  {filteredBills
                    ?.filter((bill) => bill.type === "sell")
                    .reduce(
                      (sum, bill) => sum + Number.parseFloat(bill.price),
                      0
                    )
                    .toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Revenue from filtered sales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Filtered Purchases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  $
                  {filteredBills
                    ?.filter((bill) => bill.type === "buy")
                    .reduce(
                      (sum, bill) => sum + Number.parseFloat(bill.price),
                      0
                    )
                    .toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Spent on inventory
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bills.bills?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {filterType === "all"
                  ? "All records"
                  : filterType === "buy"
                  ? "Purchase records"
                  : "Sales records"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                $
                {bills.bills
                  ?.filter((bill) => bill.type === "sell")
                  .reduce((sum, bill) => sum + Number.parseFloat(bill.price), 0)
                  .toFixed(2) || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                Revenue from sales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Purchases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                $
                {bills.bills
                  ?.filter((bill) => bill.type === "buy")
                  .reduce((sum, bill) => sum + Number.parseFloat(bill.price), 0)
                  .toFixed(2) || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                Spent on inventory
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function MyPurchasesComp() {
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills);
  const username = useSelector((state) => state.user.username);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const { getProductName } = useProductLookup();

  useEffect(() => {
    // Change this line to fetch user-specific bills
    dispatch(getUserBills());
  }, [dispatch]);

  useEffect(() => {
    if (bills.bills) {
      let filtered = [...bills.bills];

      // Apply type filter
      if (filterType !== "all") {
        filtered = filtered.filter((bill) => {
          if (filterType === "user_sale") {
            // Filter for sales that have a user (orders from users)
            return bill.type === "sell" && bill.user != null;
          } else if (filterType === "sell") {
            // Filter for admin-created sales (bills without user)
            return bill.type === "sell" && bill.user == null;
          } else {
            return bill.type === filterType;
          }
        });
      }

      // Apply search filter
      if (searchTerm.trim() !== "") {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter((bill) => {
          return (
            bill.id.toString().includes(lowerCaseSearchTerm) ||
            bill.date.toLowerCase().includes(lowerCaseSearchTerm) ||
            bill.price.toString().includes(lowerCaseSearchTerm) ||
            bill.type.toLowerCase().includes(lowerCaseSearchTerm) ||
            bill.user?.toLowerCase().includes(lowerCaseSearchTerm) ||
            bill.products_details?.some((item) =>
              getProductName(item.product.id)
                .toLowerCase()
                .includes(lowerCaseSearchTerm)
            )
          );
        });
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "date-asc":
            return new Date(a.date) - new Date(b.date);
          case "date-desc":
            return new Date(b.date) - new Date(a.date);
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          default:
            return new Date(b.date) - new Date(a.date);
        }
      });

      setFilteredBills(filtered);
    }
  }, [bills.bills, searchTerm, filterType, sortBy]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Orders
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View your order history and details
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Orders</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by ID, date: 2025-01-01, product, client or price,..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort by</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">
                      Date (Newest First)
                    </SelectItem>
                    <SelectItem value="date-asc">
                      Date (Oldest First)
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Amount (High to Low)
                    </SelectItem>
                    <SelectItem value="price-asc">
                      Amount (Low to High)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              {filteredBills.length}{" "}
              {filteredBills.length === 1 ? "order" : "orders"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bills.isUserBillsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredBills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No orders found.</p>
                <Button asChild className="mt-4">
                  <Link href="/">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {filteredBills.map((bill) => (
                  <Card key={bill.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Header Section */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 md:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <Badge variant="outline" className="bg-white w-fit">
                              #{bill.id}
                            </Badge>
                            <div className="flex items-center text-xs sm:text-sm text-gray-500">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              {formatDate(bill.date)}
                            </div>
                          </div>
                          <div className="text-lg md:text-xl font-bold text-blue-600">
                            ${Number.parseFloat(bill.price).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Order Items Section */}
                      <div className="p-3 md:p-4">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 md:mb-3">
                          Order Items
                        </h3>
                        <div className="space-y-2">
                          {bill.products_details?.length > 0 ? (
                            bill.products_details.map((item, index) => (
                              <div
                                key={index}
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 py-2 border-b last:border-0"
                              >
                                <div className="flex items-center space-x-2">
                                  <Package className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                                  <span className="font-medium text-sm sm:text-base">
                                    {getProductName(item.product.id)}
                                  </span>
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 ml-5 sm:ml-0">
                                  Qty: {item.quantity}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-400 text-xs sm:text-sm">
                              No items found
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Section */}
                      <div className="border-t p-3 md:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                        <Badge variant="secondary" className="w-fit">
                          Completed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {searchTerm.trim() !== "" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Filtered Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredBills?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {filterType === "all"
                    ? "All records"
                    : filterType === "buy"
                    ? "Purchase records"
                    : "Sales records"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  $
                  {filteredBills
                    ?.filter((bill) => bill.type === "sell")
                    .reduce(
                      (sum, bill) => sum + Number.parseFloat(bill.price),
                      0
                    )
                    .toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Revenue from filtered sales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Filtered Purchases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  $
                  {filteredBills
                    ?.filter((bill) => bill.type === "buy")
                    .reduce(
                      (sum, bill) => sum + Number.parseFloat(bill.price),
                      0
                    )
                    .toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Spent on inventory
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bills.userBills?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Lifetime purchases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                $
                {filteredBills
                  .reduce((sum, bill) => sum + Number.parseFloat(bill.price), 0)
                  .toFixed(2) || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">Lifetime spending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                $
                {filteredBills.length > 0
                  ? (
                      filteredBills.reduce(
                        (sum, bill) => sum + Number.parseFloat(bill.price),
                        0
                      ) / filteredBills.length
                    ).toFixed(2)
                  : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                Average order value
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
