"use client";
import { useState } from "react";
import withRole from "@/utils/withRole";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://e-commerce-django-hsld.onrender.com";

function NewAdmin() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
    

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    fetch(`${BASE_URL}/users/admin/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 201) {
          setSuccess("Admin created successfully!");
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
          setError("Failed to create admin. Please check the info.");
        }
      })
      .catch(() => setError("Failed to create admin. Please try again."));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">Add Admin</button>
        </form>
      </div>
    </div>
  );
}

export default withRole(NewAdmin, "ADMIN"); 