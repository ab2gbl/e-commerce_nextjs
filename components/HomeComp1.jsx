"use client";
import { useEffect } from "react";
import { initAuth } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const HomeComp1 = () => {
  const role = useSelector((state) => state.user.role);
  const isLog = useSelector((state) => state.user.isLog);

  const router = useRouter();
  useEffect(() => {
    const initialize = async () => {
      if (!isLog) {
        const isAuthenticated = await initAuth();
        if (!isAuthenticated) {
          router.push("/login");
        }
      } else {
        if (role === "ADMIN") router.push("/seller");
        else if (role === "CLIENT") router.push("/client");
        else router.push("/login");
      }
    };

    initialize();
  }, [role]);

  return <> loading</>;
};

export default HomeComp1;
