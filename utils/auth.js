import api from "@/utils/api";
import store from "@/redux/store";
import { setTokens, setInfos, clearTokens } from "@/redux/slices/userSlice";
import { getInfo } from "@/utils/user";

export const login = async (username, password) => {
  const response = await api.post("/users/token/", {
    username,
    password,
  });
  return response.data;
};
export const getTokens = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return { accessToken, refreshToken };
};

export const isTokenExpired = async (token) => {
  try {
    const response = await api.post("/users/token/verify/", { token });
    return false; // Token is valid
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return true; // Token is expired or invalid
    }
    console.error("Error verifying token:", error);
    return true;
    throw error; // Rethrow other errors
  }
};
export const refreshTokens = async (refreshToken) => {
  try {
    const response = await api.post("/users/token/refresh/", {
      refresh: refreshToken,
    });

    const data = response.data;
    localStorage.setItem("accessToken", data.access);
    if (data.refresh) {
      localStorage.setItem("refreshToken", data.refresh);
    }
    return data;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (error.response && error.response.status === 401) {
      console.log("Refresh token expired:", error);
      throw new Error("Refresh token expired. Please login again.");
    }
    console.error("Failed to refresh token:", error);
    //return false;
    throw error;
  }
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
        console.log("Failed to refresh tokens");
        store.dispatch(clearTokens());
        return false; // Refresh failed, cannot proceed
      }
      console.log("refreshed");

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
