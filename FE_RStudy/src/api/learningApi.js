import axiosClient from "./axiosClient";

export const learningApi = {
  get: (courseId) => axiosClient.get(`/learning/${courseId}`),
  update: (courseId, body) => axiosClient.put(`/learning/${courseId}`, body),
  createSession: (courseId, body) => axiosClient.post(`/learning/${courseId}/sessions`, body),
  updateSession: (id, body) => axiosClient.put(`/learning/sessions/${id}`, body),
  removeSession: (id) => axiosClient.delete(`/learning/sessions/${id}`),
};
