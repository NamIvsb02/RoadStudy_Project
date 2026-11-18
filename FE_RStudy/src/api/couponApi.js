import axiosClient from "./axiosClient";

export const couponApi = {
  getList: (params) => axiosClient.get("/coupon", { params }),
  create: (body) => axiosClient.post("/coupon", body),
  update: (id, body) => axiosClient.put(`/coupon/${id}`, body),
  changeStatus: (id, status) => axiosClient.patch(`/coupon/${id}/status`, { status }),
  remove: (id) => axiosClient.delete(`/coupon/${id}`),
  validate: (body) => axiosClient.post("/coupon/validate", body),
};
