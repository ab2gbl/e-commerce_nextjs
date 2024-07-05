// components/Navbar.js
"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { logout } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.username);

  const dispatch = useDispatch();

  return (
    <div className="w-full grid grid-cols-4">
      <Link href="/">Home</Link>
      <Link href="/cart">Cart</Link>
      {!role ? (
        <Link href="/login">Login</Link>
      ) : (
        <>
          <button
            onClick={() => {
              dispatch(logout());
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              router.push("/login");
            }}
          >
            Logout
          </button>
          <span>
            {" "}
            {username} ({role})
          </span>
        </>
      )}
    </div>
  );
}
