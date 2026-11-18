import axiosClient from "./axiosClient";

export const invoiceApi = {
  getList: (params) => axiosClient.get("/invoice", { params }),
  getRefundRequests: (params) => axiosClient.get("/invoice/refund-requests", { params }),
};
