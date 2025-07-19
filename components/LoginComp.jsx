// Example usage in a component (components/Login.js)
import { useDispatch } from "react-redux";
import { setTokens, setInfos } from "@/redux/slices/userSlice";
import { login } from "../utils/auth";
import { getInfo } from "../utils/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const LoginComp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const { username, password } = event.target.elements;

    try {
      setError("");
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
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign in to your account</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account?</span>
          <Link href="/register" className="ml-2 text-blue-600 hover:underline font-semibold">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComp;
