import axiosClient from "./axiosClient";

export const examApi = {
  getById: (id) => axiosClient.get(`/exam/${id}`),
  listByCourse: (courseId, params) => axiosClient.get(`/exam/course/${courseId}`, { params }),
  create: (body) => axiosClient.post("/exam", body),
  changeStatus: (id, status) => axiosClient.patch(`/exam/${id}/status`, { status }),
  remove: (id) => axiosClient.delete(`/exam/${id}`),
  update: (id, body) => axiosClient.put(`/exam/${id}`, body),
};
