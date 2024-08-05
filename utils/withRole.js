import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { initAuth } from "@/utils/auth";
import store from "@/redux/store";

const withAuth = (WrappedComponent, requiredRole) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const role = store.getState().user.role;
    const isLog = store.getState().user.isLog;
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        if (!isLog) {
          const isAuthenticated = await initAuth();
          if (!isAuthenticated && requiredRole !== "null") {
            router.push("/login");
            return;
          }
          setLoading(false);
          return;
        }
        if (
          !(requiredRole === "null" && !isLog) &&
          requiredRole &&
          role !== requiredRole
        ) {
          console.log("pushed from withRole");
          console.log("1", !(requiredRole === "null" && !isLog));
          console.log("2", requiredRole);
          console.log("3", role !== requiredRole, role, requiredRole);
          router.push("/");
          return;
        }

        setLoading(false);
      };

      checkAuth();
    }, [role]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
