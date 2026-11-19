import axiosClient from "./axiosClient";

export const notificationApi = {
  getList: (params) => axiosClient.get("/notification", { params }),
  getUnreadCount: () => axiosClient.get("/notification/unread-count"),
  markRead: (id) => axiosClient.patch(`/notification/${id}/read`),
  markAllRead: () => axiosClient.patch("/notification/read-all"),
};
