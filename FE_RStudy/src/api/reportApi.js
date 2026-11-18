import axiosClient from "./axiosClient";

export const reportApi = {
  getList: (params) => axiosClient.get("/report", { params }),
  create: (body) => axiosClient.post("/report", body),
  process: (id, body) => axiosClient.patch(`/report/${id}/process`, body),
  reject: (id, resolutionResult) => axiosClient.patch(`/report/${id}/reject`, { resolutionResult }),
};
