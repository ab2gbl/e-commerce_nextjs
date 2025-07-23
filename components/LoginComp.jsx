"use client";
import { useDispatch } from "react-redux";
import { setTokens, setInfos } from "@/redux/slices/userSlice";
import { login } from "../utils/auth";
import { getInfo } from "../utils/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Loader2,
  ArrowRight,
  Smartphone,
  Shield,
  Truck,
  Headphones,
  Star,
  CheckCircle,
} from "lucide-react";

const LoginComp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const { username, password } = event.target.elements;

    setIsLoading(true);
    setError("");

    try {
      const tokens = await login(username.value, password.value);
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);

      dispatch(
        setTokens({
          access: tokens.access,
          refresh: tokens.refresh,
        })
      );

      const info = await getInfo();
      dispatch(setInfos(info));
      router.push("/");
    } catch (error) {
      setError("Invalid username or password");
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Smartphone,
      title: "Latest Phones",
      description: "Discover the newest smartphones from top brands",
    },
    {
      icon: Headphones,
      title: "Premium Accessories",
      description: "High-quality accessories for all your devices",
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Safe and secure payment processing",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick shipping to your doorstep",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing selection and great prices!",
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment: "Fast delivery and excellent customer service.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Presentation */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
            <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full"></div>
            <div className="absolute bottom-32 left-32 w-40 h-40 border border-white rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 border border-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            {/* Brand Header */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold">PhoneStore</h1>
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Your Ultimate
                <br />
                <span className="text-yellow-300">Mobile Experience</span>
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Discover the latest smartphones and premium accessories from top
                brands worldwide
              </p>
            </div>

            {/* Features Grid */}

            {/* Testimonials */}
            {/* Stats */}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-4 lg:p-12">
          <div className="w-full max-w-md">
            {/* Welcome Back Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 ">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Sign in to your account to continue shopping
              </p>
            </div>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-semibold text-center">
                  Sign In
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        required
                        disabled={isLoading}
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                        className="pl-10 pr-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <Alert
                      variant="destructive"
                      className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                    >
                      <AlertDescription className="text-red-700 dark:text-red-400">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in... (first request may take 1 min)
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Create one now
                    </Link>
                    <br />
                    or use the next ones
                  </p>
                </div>

                {/* Trust Indicators */}
                {/* Test Credentials */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <div className="bg-green-100 dark:bg-green-800 rounded-full p-2 mr-2">
                            <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <h5 className="text-sm font-semibold text-green-800 dark:text-green-300">
                            Demo Accounts for Testing
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-green-200 dark:border-green-700">
                            <div className="flex items-center mb-2">
                              <Shield className="h-3 w-3 mr-1 text-green-500" />
                              <label className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wide">
                                Admin Account
                              </label>
                            </div>
                            <div className="space-y-1">
                              <p className="font-mono text-gray-800 dark:text-gray-200 text-xs">
                                Username:{" "}
                                <span className="font-semibold">admin</span>
                              </p>
                              <p className="font-mono text-gray-800 dark:text-gray-200 text-xs">
                                Password:{" "}
                                <span className="font-semibold">admin0000</span>
                              </p>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-green-200 dark:border-green-700">
                            <div className="flex items-center mb-2">
                              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                              <label className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wide">
                                Client Account
                              </label>
                            </div>
                            <div className="space-y-1">
                              <p className="font-mono text-gray-800 dark:text-gray-200 text-xs">
                                Username:{" "}
                                <span className="font-semibold">client1</span>
                              </p>
                              <p className="font-mono text-gray-800 dark:text-gray-200 text-xs">
                                Password:{" "}
                                <span className="font-semibold">
                                  client0000client
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-green-600 dark:text-green-400 italic text-center">
                          Use these credentials to explore different user roles
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Additional Links */}

            {/* Mobile Features Preview */}
            <div className="lg:hidden mt-8">
              <div className="grid grid-cols-2 gap-4">
                {features.slice(0, 4).map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm"
                    >
                      <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        {feature.title}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComp;
