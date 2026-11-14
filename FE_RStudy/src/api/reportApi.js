import axiosClient from "./axiosClient";

export const reportApi = {
  getList: (params) => axiosClient.get("/report", { params }),
};
