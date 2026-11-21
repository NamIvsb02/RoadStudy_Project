import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatbotApi } from "../api/chatbotApi";
import { useAuth } from "./useAuth";

export function useConversations(enabled) {
  const { account } = useAuth();

  return useQuery({
    queryKey: ["chatbot", account?.id, "conversations"],
    queryFn: async () => (await chatbotApi.getConversations({ limit: 20 })).data.items,
    enabled: enabled && Boolean(account),
  });
}

export function useSendMessage() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (body) => (await chatbotApi.sendMessage(body)).data,
    onSuccess: () => client.invalidateQueries({ queryKey: ["chatbot"] }),
  });
}

export function useOpenConversation() {
  return useMutation({ mutationFn: async (id) => (await chatbotApi.getConversation(id)).data });
}
