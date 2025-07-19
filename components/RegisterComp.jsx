"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterComp() {
  const [popup, setPopup] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://e-commerce-django-hsld.onrender.com";
  const SingIn = (e) => {
    e.preventDefault();
    setError("");
    setPopup(false);
    fetch(`${BASE_URL}/users/client/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 201) {
          setPopup(true);
          setForm({ username: "", email: "", password: "" });
        } else if (data.username && data.username[0]?.includes("already exists")) {
          setError("Username already exists.");
        } else if (data.email && data.email[0]?.includes("already exists")) {
          setError("Email already exists.");
        } else if (data.password) {
          setError("Password: " + data.password.join(", "));
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError("Registration failed. Please check your info.");
        }
      })
      .catch(() => setError("Registration failed. Please try again."));
  };
  if (popup) {
    return (
      <div className="text-center">
        <p className="mb-4 text-green-600 font-semibold">Your account was created successfully! You can now login.</p>
        <Link href="/login" className="text-blue-600 hover:underline font-bold">Go to login page</Link>
      </div>
    );
  }
  return (
    <form onSubmit={SingIn} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          type="text"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
      >
        Register
      </button>
      <div className="mt-6 text-center">
          <span className="text-gray-600">You have an account?</span>
          <Link href="/login" className="ml-2 text-blue-600 hover:underline font-semibold">Login</Link>
        </div>

    </form>
  );
}
