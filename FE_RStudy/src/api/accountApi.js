import axiosClient from "./axiosClient";

export const accountApi = {
  updateProfile: (body) => axiosClient.patch("/account/profile", body),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return axiosClient.post("/account/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getList: (params) => axiosClient.get("/account", { params }),
  changeStatus: (id, status) => axiosClient.patch(`/account/${id}/status`, { status }),
};
