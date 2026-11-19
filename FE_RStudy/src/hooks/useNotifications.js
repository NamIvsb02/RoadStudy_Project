import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notificationApi";
import { useAuth } from "./useAuth";

const POLL_MS = 30000;

export function useUnreadCount() {
  const { account } = useAuth();

  return useQuery({
    queryKey: ["notifications", account?.id, "unread"],
    queryFn: async () => (await notificationApi.getUnreadCount()).data.unreadCount,
    enabled: Boolean(account),
    refetchInterval: POLL_MS,
  });
}

export function useNotificationList(enabled) {
  const { account } = useAuth();

  return useQuery({
    queryKey: ["notifications", account?.id, "list"],
    queryFn: async () => (await notificationApi.getList({ limit: 20 })).data,
    enabled: enabled && Boolean(account),
  });
}

export function useMarkRead() {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: ["notifications"] });
  const one = useMutation({ mutationFn: (id) => notificationApi.markRead(id), onSuccess: refresh });
  const all = useMutation({ mutationFn: () => notificationApi.markAllRead(), onSuccess: refresh });

  return { markOne: one.mutate, markAll: all.mutate, markingAll: all.isPending };
}
