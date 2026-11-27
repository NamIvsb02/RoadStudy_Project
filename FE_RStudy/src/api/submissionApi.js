import axiosClient from "./axiosClient";

export const submissionApi = {
  start: (examId) => axiosClient.post("/submission/start", { examId }),
  saveAnswers: (id, answers) => axiosClient.put(`/submission/${id}/answers`, { answers }),
  submit: (id, body) => axiosClient.post(`/submission/${id}/submit`, body),
  getMine: (params) => axiosClient.get("/submission/me", { params }),
  getById: (id) => axiosClient.get(`/submission/${id}`),
  listByExam: (examId, params) => axiosClient.get(`/submission/exam/${examId}`, { params }),
  listManage: (params) => axiosClient.get("/submission/manage", { params }),
};
