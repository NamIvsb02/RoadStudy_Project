import axiosClient from "./axiosClient";

export const adminApi = {
  getMe: () => axiosClient.get("/admin/me"),
  getSystemFunctions: () => axiosClient.get("/admin/system-functions"),
  getAdministrators: (params) => axiosClient.get("/admin/administrators", { params }),
  setStatus: (id, status) => axiosClient.patch(`/admin/administrators/${id}/status`, { status }),
  setPermissions: (id, functionIds) => axiosClient.put(`/admin/administrators/${id}/permissions`, { functionIds }),
  create: (body) => axiosClient.post("/admin/administrators", body),
};
