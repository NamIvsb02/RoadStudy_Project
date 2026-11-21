import axiosClient from "./axiosClient";

export const categoryApi = {
  getPublicList: (params) => axiosClient.get("/category", { params }),
  getAdminList: (params) => axiosClient.get("/category/manage", { params }),
  create: (body) => axiosClient.post("/category", body),
  update: (id, body) => axiosClient.put(`/category/${id}`, body),
  changeStatus: (id, status) => axiosClient.patch(`/category/${id}/status`, { status }),
  remove: (id) => axiosClient.delete(`/category/${id}`),
};
