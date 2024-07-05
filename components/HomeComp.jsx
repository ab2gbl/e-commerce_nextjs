"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getInfo, refreshTokens, setTokens } from "@/redux/slices/userSlice";
import useInitializeAuth from "@/hooks/useInitializeAuth";

function HomeComp() {
  const router = useRouter();
  const dispatch = useDispatch();
  const access = useSelector((state) => state.user.access);
  const role = useSelector((state) => state.user.role);
  const error = useSelector((state) => state.user.error);
  const isLog = useSelector((state) => state.user.isLog);

  useEffect(() => {
    if (!isLog) {
      console.log("User is not logged in, initializing authentication...");
      useInitializeAuth(); // Call the custom hook for initialization
    }
  }, [isLog]); // Ensure useEffect runs when isLog changes

  useEffect(() => {
    if (isLog) {
      if (role === "ADMIN") router.push("/seller");
      else if (role === "CLIENT") router.push("/client");
      else router.push("/login");
    }
  }, [isLog, role, router]); // Ensure useEffect runs when isLog or role changes

  return <div>Loading...</div>;
}

export default HomeComp;
