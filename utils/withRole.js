import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { initAuth } from "@/utils/user";
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
        }
        if (requiredRole && role !== requiredRole && requiredRole !== "null") {
          router.push("/"); // Or any other route you use for unauthorized access
          return;
        }

        setLoading(false); // Authentication and role check complete
      };

      checkAuth();
    }, [role]);

    // Render a loading state until the authentication check is complete
    if (loading) {
      return <div>Loading...</div>; // Customize this to your loading component
    }

    // Once loading is false, render the wrapped component
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
