import axiosClient from "./axiosClient";

export const enrollmentApi = {
  getMine: (params) => axiosClient.get("/enrollment/me", { params }),
};
