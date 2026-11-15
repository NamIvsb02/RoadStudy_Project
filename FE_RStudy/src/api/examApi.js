import axiosClient from "./axiosClient";

export const examApi = {
  getById: (id) => axiosClient.get(`/exam/${id}`),
  listByCourse: (courseId, params) => axiosClient.get(`/exam/course/${courseId}`, { params }),
};
