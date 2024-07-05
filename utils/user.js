import api from "@/utils/api";
import store from "@/redux/store";
import { setTokens, setInfos, clearTokens } from "@/redux/slices/userSlice";
import { getTokens, refreshTokens, isTokenExpired } from "./auth";

export const getInfo = async () => {
  const response = await api.get("/users/myinfo/");
  if (response.status !== 200) {
    throw new Error("Failed to fetch user role");
  }
  return response.data;
};

export const initAuth = async () => {
  try {
    const { accessToken, refreshToken } = getTokens();

    if (!accessToken) {
      console.log("No access token");
      return false; // No access token, cannot proceed
    }

    let testTokenExpired = await isTokenExpired(accessToken);
    let validAccessToken;
    if (testTokenExpired) {
      console.log("Refreshing tokens");
      const tokens = await refreshTokens(refreshToken);
      if (!tokens) {
        store.dispatch(clearTokens());
        return false; // Refresh failed, cannot proceed
      }

      store.dispatch(
        setTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
      );

      // Update valid access token for further use
      validAccessToken = tokens.accessToken;
    } else {
      validAccessToken = accessToken;
      store.dispatch(
        setTokens({
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
      ); // Token is valid
    }

    // Use the valid access token to fetch user info
    api.defaults.headers.common["Authorization"] = `Bearer ${validAccessToken}`;
    const infos = await getInfo();
    store.dispatch(setInfos(infos));
    return true;
  } catch (error) {
    console.error("Error initializing auth:", error);
    return false;
  }
};
