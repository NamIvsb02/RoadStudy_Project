import axiosClient from "./axiosClient";

export const invoiceApi = {
  getList: (params) => axiosClient.get("/invoice", { params }),
  getRefundRequests: (params) => axiosClient.get("/invoice/refund-requests", { params }),
  uploadProof: (id, file) => {
    const formData = new FormData();
    formData.append("proof", file);
    return axiosClient.post(`/invoice/${id}/proof`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  },
  getProof: (id) => axiosClient.get(`/invoice/${id}/proof`, { responseType: "blob" }),
  requestRefund: (id, description) => axiosClient.post(`/invoice/${id}/refund-request`, { description }),
  approve: (id) => axiosClient.patch(`/invoice/${id}/approve`),
  reject: (id, reason) => axiosClient.patch(`/invoice/${id}/reject`, { reason }),
  approveRefund: (id) => axiosClient.patch(`/invoice/refund-requests/${id}/approve`, {}),
  completeRefund: (id) => axiosClient.patch(`/invoice/refund-requests/${id}/complete`, {}),
  rejectRefund: (id, adminNote, cancelRegistration) => axiosClient.patch(`/invoice/refund-requests/${id}/reject`, { adminNote, ...(cancelRegistration && { cancelRegistration: true }) }),
};
