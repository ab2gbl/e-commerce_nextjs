import api from "@/utils/api";

export const getInfo = async (accessToken) => {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  const response = await api.get("/users/myinfo/", { headers });
  if (response.status !== 200) {
    throw new Error("Failed to fetch user role");
  }
  return response.data;
};
