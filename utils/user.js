import api from "@/utils/api";

export const getInfo = async () => {
  const response = await api.get("/users/myinfo/");
  if (response.status !== 200) {
    throw new Error("Failed to fetch user role");
  }
  return response.data;
};
