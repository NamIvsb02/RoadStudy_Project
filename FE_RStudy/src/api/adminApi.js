import axiosClient from "./axiosClient";

export const adminApi = {
  getMe: () => axiosClient.get("/admin/me"),
};
