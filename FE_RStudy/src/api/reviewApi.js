import axiosClient from './axiosClient';

export const reviewApi = {
  listByCourse: (courseId, params) => axiosClient.get(`/review/course/${courseId}`, { params }),
  getMine: (courseId) => axiosClient.get(`/review/course/${courseId}/mine`),
  create: (courseId, body) => axiosClient.post(`/review/course/${courseId}`, body),
  update: (id, body) => axiosClient.put(`/review/${id}`, body),
  respond: (id, body) => axiosClient.post(`/review/${id}/responses`, body),
  updateResponse: (responseId, body) => axiosClient.put(`/review/responses/${responseId}`, body),
  removeResponse: (responseId) => axiosClient.delete(`/review/responses/${responseId}`),
};