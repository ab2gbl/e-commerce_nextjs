"use client";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { logout } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Smartphone,
  ShoppingCart,
  User,
  Settings,
  LogOut,
  Menu,
  Plus,
  FileText,
  Users,
  Package,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  const adminMenuItems = [
    { href: "/seller/newadmin", label: "Add Admin", icon: Users },
    { href: "/seller/newbill", label: "Add Bill", icon: Plus },
    { href: "/seller/bills", label: "Bills", icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              PhoneStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {role === "ADMIN" && (
              <Link
                href="/seller"
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/client"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/cart"
              className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
            </Link>
            {role && (
              <Link
                href="/mybills"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              >
                My Orders
              </Link>
            )}

            {/* Admin Dropdown */}
            {role === "ADMIN" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="flex items-center">
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Menu */}
            {!role ? (
              <Button asChild variant="default">
                <Link href="/login">Sign In</Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{username}</span>
                    <Badge variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/myinfo" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                <Link
                  href="/client"
                  className="flex items-center space-x-2 text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Package className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center space-x-2 text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </Link>
                {role && (
                  <Link
                    href="/mybills"
                    className="flex items-center space-x-2 text-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="h-5 w-5" />
                    <span>My Orders</span>
                  </Link>
                )}

                {role === "ADMIN" && (
                  <>
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold text-red-600 mb-2">
                        Admin Actions
                      </h3>

                      {adminMenuItems.slice(1).map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-2 text-sm py-2"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className="border-t pt-4">
                  {!role ? (
                    <Button asChild className="w-full">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 mb-4">
                        <User className="h-5 w-5" />
                        <span className="font-medium">{username}</span>
                        <Badge variant="secondary">{role}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
