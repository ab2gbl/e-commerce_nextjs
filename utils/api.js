// services/api.js
import axios from "axios";
import store from "@/redux/store";
import { refreshTokens as refreshAccessToken } from "./auth";
import { setTokens, clearTokens } from "@/redux/slices/userSlice";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
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
