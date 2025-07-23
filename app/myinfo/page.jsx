"use client";
import { useEffect, useState } from "react";
import { getInfo } from "@/utils/user";
import withRole from "@/utils/withRole";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Shield,
  ArrowLeft,
  Edit,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";

function MyInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    getInfo(accessToken)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user info.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <div className="text-red-500 text-lg">{error}</div>
            <Button asChild className="mt-4">
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <User className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Profile
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage your account information
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <CardDescription>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                  className="mt-2"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      <span>Username</span>
                    </div>
                    <p className="text-lg font-medium">{user.username}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </div>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Shield className="h-4 w-4" />
                      <span>Account Type</span>
                    </div>
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                    >
                      {user.role === "ADMIN" ? "Administrator" : "Customer"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Member Since</span>
                    </div>
                    <p className="text-lg font-medium">
                      {/*new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })*/}
                      not available
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Actions</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Lock className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  {user.role === "CLIENT" && (
                    <Button
                      variant="outline"
                      asChild
                      className="flex-1 bg-transparent"
                    >
                      <Link href="/mybills">
                        <Mail className="h-4 w-4 mr-2" />
                        View Orders
                      </Link>
                    </Button>
                  )}
                  {user.role === "ADMIN" && (
                    <Button
                      variant="outline"
                      asChild
                      className="flex-1 bg-transparent"
                    >
                      <Link href="/seller">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Account Stats */}
              {user.role === "CLIENT" && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Account Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">0</p>
                        <p className="text-sm text-gray-600">Total Orders</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">$0</p>
                        <p className="text-sm text-gray-600">Total Spent</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg md:col-span-1 col-span-2">
                        <p className="text-2xl font-bold text-purple-600">0</p>
                        <p className="text-sm text-gray-600">Items in Cart</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default withRole(MyInfo, ["ADMIN", "CLIENT"]);
