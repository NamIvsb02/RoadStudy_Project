import axiosClient from "./axiosClient";

export const chatbotApi = {
  sendMessage: (body) => axiosClient.post("/chatbot/messages", body),
  getConversations: (params) => axiosClient.get("/chatbot/conversations", { params }),
  getConversation: (id) => axiosClient.get(`/chatbot/conversations/${id}`),
};
