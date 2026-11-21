import { Loader2 } from "lucide-react";
import { useConversations } from "../../hooks/useChatbot";
import { timeAgo } from "../../utils/format";

export default function ChatHistory({ opening, onOpen }) {
  const { data, isPending, isError, error } = useConversations(true);
  const items = data ?? [];

  if (isPending)
    return (
      <p className="flex items-center justify-center gap-2 p-6 text-sm text-muted">
        <Loader2 size={16} className="animate-spin" />
        Đang tải...
      </p>
    );
  if (isError) return <p className="p-6 text-center text-sm text-danger">{error.message}</p>;
  if (items.length === 0) return <p className="p-6 text-center text-sm text-muted">Bạn chưa có cuộc trò chuyện nào.</p>;

  return (
    <ul className="flex-1 overflow-y-auto bg-white">
      {items.map((conversation) => (
        <li key={conversation.id}>
          <button
            type="button"
            disabled={opening}
            onClick={() => onOpen(conversation.id)}
            className="block w-full border-b border-line px-4 py-3 text-left transition-colors hover:bg-soft disabled:opacity-60"
          >
            <span className="block truncate text-sm font-semibold text-ink">{conversation.firstMessage ?? "Cuộc trò chuyện mới"}</span>
            <span className="text-xs text-muted">
              {timeAgo(conversation.startTime)} · {conversation.messageCount} tin nhắn
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
