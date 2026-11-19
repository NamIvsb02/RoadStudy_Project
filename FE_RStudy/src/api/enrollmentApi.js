import axiosClient from "./axiosClient";

export const enrollmentApi = {
  getMine: (params) => axiosClient.get("/enrollment/me", { params }),
  getById: (id) => axiosClient.get(`/enrollment/${id}`),
  create: (body) => axiosClient.post("/enrollment", body),
  cancel: (id) => axiosClient.post(`/enrollment/${id}/cancel`),
};
