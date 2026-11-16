import axiosClient from "./axiosClient";

export const courseApi = {
  getPublicList: (params) => axiosClient.get("/course", { params }),
  getPublicById: (id) => axiosClient.get(`/course/${id}`),
  getMine: (params) => axiosClient.get("/course/mine", { params }),
  getAdminList: (params) => axiosClient.get("/course/manage", { params }),
};
