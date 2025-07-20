// components/Navbar.js
"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { logout } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
              dispatch(logout());
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">E-Commerce</Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="hover:text-blue-600 font-medium">Home</Link>
            <Link href="/cart" className="hover:text-blue-600 font-medium">Cart</Link>
            <Link href="/myinfo" className="hover:text-blue-600 font-medium">My Info</Link>
            {role === "ADMIN" && (
              <>
                <Link href="/seller/newadmin" className="hover:text-blue-600 font-medium">Add Admin</Link>
                <Link href="/seller/newbill" className="hover:text-blue-600 font-medium">Add Bill</Link>
                <Link href="/seller/bills" className="hover:text-blue-600 font-medium">Bills</Link>
              </>
            )}
            {!role ? (
              <Link href="/login" className="hover:text-blue-600 font-medium">Login</Link>
            ) : (
              <>
                <span className="text-gray-700 font-medium">{username} ({role})</span>
                <button
                  onClick={handleLogout}
                  className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pt-2 pb-4 space-y-2">
          <Link href="/" className="block hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/cart" className="block hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Cart</Link>
          <Link href="/myinfo" className="block hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>My Info</Link>
          {role === "ADMIN" && (
            <>
              <Link href="/seller/newadmin" className="block hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Add Admin</Link>
              <Link href="/seller/newbill" className="block hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Add Bill</Link>
              <Link href="/seller/bills" className="block hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Bills</Link>
            </>
          )}
          {!role ? (
            <Link href="/login" className="block hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
          ) : (
            <>
              <span className="block text-gray-700 font-medium">{username} ({role})</span>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="mt-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition duration-200 w-full text-left"
          >
            Logout
          </button>
        </>
      )}
    </div>
      )}
    </nav>
  );
}
