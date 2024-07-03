// components/Navbar.js
"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { logout } from "@/redux/slices/userSlice";

export default function Navbar() {
  const role = useSelector((state) => state.user.role);
  const dispatch = useDispatch();

  return (
    <div className="w-full grid grid-cols-3">
      <Link href="/">Home</Link>
      <Link href="/cart">Cart</Link>
      {role === "" ? (
        <Link href="/login">Login</Link>
      ) : (
        <button onClick={() => dispatch(logout())}>Logout</button>
      )}
    </div>
  );
}
