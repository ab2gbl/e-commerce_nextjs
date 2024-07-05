// hooks/useInitializeAuth.js
/*
import { useEffect } from "react";
import { useRouter } from "next/router"; // Correct import path for Next.js 14
import { useDispatch } from "react-redux";
import { setTokens, setInfos, clearTokens } from "@/redux/slices/userSlice";
import { refreshAccessToken, getInfo } from "@/services/authService";
import store from "@/redux/store";

const useInitializeAuth = () => {
  const router = useRouter(); // useRouter inside function component

  useEffect(() => {
    console.log("useInitializeAuth");

    const initialize = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        router.push("/login"); // No tokens available, redirect to login
        return;
      }

      try {
        // Try fetching user info with the current access token
        const userInfo = await getInfo();
        store.dispatch(setInfos(userInfo));
      } catch (error) {
        try {
          // If access token is expired, try refreshing it
          const newTokens = await refreshAccessToken(refreshToken);
          console.log("newTokens", newTokens);
          localStorage.setItem("accessToken", newTokens.access);
          localStorage.setItem(
            "refreshToken",
            newTokens.refresh || refreshToken
          );

          store.dispatch(
            setTokens({
              access: newTokens.access,
              refresh: newTokens.refresh || refreshToken,
            })
          );

          // Fetch user info again with the new access token
          const userInfo = await getInfo();
          store.dispatch(setInfos(userInfo));
        } catch (refreshError) {
          // Refresh token failed, clear tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          store.dispatch(clearTokens());
          router.push("/login");
        }
      }
    };

    initialize();
  }, [router]); // Dependency array includes router

  // Return a cleanup function if needed in the future
  return () => {
    // Cleanup logic if necessary
  };
};

export default useInitializeAuth;
*/
