// services/api.js
import axios from "axios";
import store from "@/redux/store";
import { refreshTokens as refreshAccessToken } from "./auth";
import { setTokens, clearTokens } from "@/redux/slices/userSlice";

// Use NEXT_PUBLIC_API_BASE_URL from environment, fallback to default
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://e-commerce-django-hsld.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.user.access;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    //console.log("Error response: will try to refresh token");
    const originalRequest = error.config;
    //console.log("originalRequest: ", originalRequest);
    if (error.response.status === 401 && !originalRequest._retry) {
      //console.log("now the first if worked ");

      originalRequest._retry = true;
      const refreshToken =
        store.getState().user.refreshToken ||
        localStorage.getItem("refreshToken");
      //console.log("got refreshToken ");

      if (refreshToken) {
        try {
          const newTokens = await refreshAccessToken(refreshToken);
          localStorage.setItem("accessToken", newTokens.access);
          store.dispatch(
            setTokens({
              accessToken: newTokens.access,
              refreshToken: newTokens.refresh || refreshToken,
            })
          );
          console.log("tokens refreshed");
          originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(clearTokens());
          console.error("Token refresh failed:", refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
