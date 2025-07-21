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
            {role && (
              <Link href="/mybills" className="hover:text-blue-600 font-medium">My Purchases</Link>
            )}
            {role === "ADMIN" && (
              <div className="relative group">
                <button className="hover:text-red-700 text-red-600 font-semibold focus:outline-none flex items-center">
                  Admin Actions
                  <svg className="inline ml-1 w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ul className="absolute left-0 mt-2 w-44 bg-white border border-red-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 z-50">
                  <li>
                    <Link href="/seller/newadmin" className="block px-4 py-2 hover:bg-red-50 text-red-700 hover:text-red-900 font-semibold">Add Admin</Link>
                  </li>
                  <li>
                    <Link href="/seller/newbill" className="block px-4 py-2 hover:bg-red-50 text-red-700 hover:text-red-900 font-semibold">Add Bill</Link>
                  </li>
                  <li>
                    <Link href="/seller/bills" className="block px-4 py-2 hover:bg-red-50 text-red-700 hover:text-red-900 font-semibold">Bills</Link>
                  </li>
                </ul>
              </div>
            )}
            

            {!role ? (
              <Link href="/login" className="hover:text-blue-600 font-medium">Login</Link>
            ) : (
              <>
                <Link href="/myinfo" className="hover:text-blue-600 font-medium"> 
                  <span className="text-gray-700 font-medium">{username} ({role})</span>
                </Link>
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
