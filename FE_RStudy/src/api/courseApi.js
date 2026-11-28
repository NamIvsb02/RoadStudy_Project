import axiosClient from "./axiosClient";

export const courseApi = {
  getPublicList: (params) => axiosClient.get("/course", { params }),
  getPublicById: (id) => axiosClient.get(`/course/${id}`),
  getMine: (params) => axiosClient.get("/course/mine", { params }),
  getAdminList: (params) => axiosClient.get("/course/manage", { params }),
  getMyById: (id) => axiosClient.get(`/course/mine/${id}`),
  getAdminById: (id) => axiosClient.get(`/course/manage/${id}`),
  create: (body) => axiosClient.post("/course", body),
  update: (id, body) => axiosClient.put(`/course/${id}`, body),
  submit: (id) => axiosClient.post(`/course/${id}/submit`),
  approve: (id) => axiosClient.post(`/course/${id}/approve`),
  reject: (id, reason) => axiosClient.post(`/course/${id}/reject`, { reason }),
  changeStatus: (id, status) => axiosClient.patch(`/course/${id}/status`, { status }),
  uploadCover: (file) => {
    const formData = new FormData();
    formData.append("cover", file);
    return axiosClient.post("/course/cover", formData, { headers: { "Content-Type": "multipart/form-data" } });
  },
};
