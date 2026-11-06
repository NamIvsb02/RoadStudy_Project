import axiosClient from './axiosClient';

export const commentApi = {
  listByCourse: (courseId, params) => axiosClient.get(`/comment/course/${courseId}`, { params }),
  create: (courseId, body) => axiosClient.post(`/comment/course/${courseId}`, body),
  update: (id, body) => axiosClient.put(`/comment/${id}`, body),
  remove: (id) => axiosClient.delete(`/comment/${id}`),
  reply: (id, body) => axiosClient.post(`/comment/${id}/replies`, body),
  updateReply: (replyId, body) => axiosClient.put(`/comment/replies/${replyId}`, body),
  removeReply: (replyId) => axiosClient.delete(`/comment/replies/${replyId}`),
};