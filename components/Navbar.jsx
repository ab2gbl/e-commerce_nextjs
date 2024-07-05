// components/Navbar.js
"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { logout } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const role = useSelector((state) => state.user.role);
  const dispatch = useDispatch();

  return (
    <div className="w-full grid grid-cols-3">
      <Link href="/">Home</Link>
      <Link href="/cart">Cart</Link>
      {role === "" ? (
        <Link href="/login">Login</Link>
      ) : (
        <button
          onClick={() => {
            dispatch(logout());
            router.push("/login");
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
}
