import api from "@/utils/api"; // Assuming api is an axios instance

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
    throw error;
  }
};
