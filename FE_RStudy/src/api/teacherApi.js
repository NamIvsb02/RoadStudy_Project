import axiosClient from "./axiosClient";

export const teacherApi = {
  getPublicList: (params) => axiosClient.get("/teacher", { params }),
  getPublicById: (id) => axiosClient.get(`/teacher/${id}`),
  getAdminList: (params) => axiosClient.get("/teacher/admin/list", { params }),
  setApproval: (id, approvalStatus) => axiosClient.patch(`/teacher/${id}/approval`, { approvalStatus }),
};
