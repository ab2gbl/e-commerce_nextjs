import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { initAuth } from "@/utils/auth";
import store from "@/redux/store";
import { Loader2 } from "lucide-react";

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
        // Allow requiredRole to be an array of roles
        if (
          !(requiredRole === "null" && !isLog) &&
          requiredRole &&
          ((Array.isArray(requiredRole) && !requiredRole.includes(role)) ||
            (!Array.isArray(requiredRole) && role !== requiredRole))
        ) {
          console.log("pushed from withRole");
          console.log("1", !(requiredRole === "null" && !isLog));
          console.log("2", requiredRole);
          console.log("3", role, requiredRole);
          router.push("/");
          return;
        }

        setLoading(false);
      };

      checkAuth();
    }, [role]);

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border max-w-md w-full mx-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Authenticating
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Please wait while we verify your access...
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-md">
                  ⏱️ First request may take up to 1 minute if the backend is
                  starting up
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
