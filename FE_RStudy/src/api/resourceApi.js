import axiosClient from "./axiosClient";

export const resourceApi = {
  getList: (params) => axiosClient.get("/resource", { params }),
  upload: (formData) => axiosClient.post("/resource", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  remove: (id) => axiosClient.delete(`/resource/${id}`),
};
