"use client";
import { useEffect, useState } from "react";
import { getInfo } from "@/utils/user";
import withRole from "@/utils/withRole";
function MyInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
    getInfo(accessToken)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user info.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>;
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Profile</h2>
        <div className="space-y-4">
          <div><span className="font-semibold">Username:</span> {user.username}</div>
          <div><span className="font-semibold">Email:</span> {user.email}</div>
          <div><span className="font-semibold">Role:</span> {user.role}</div>
        </div>
      </div>
    </div>
  );
} 

export default withRole(MyInfo, ["ADMIN", "CLIENT"]);