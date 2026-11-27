import { MessagesSquare } from "lucide-react";
import EmptyState from "../common/EmptyState";
import ListSkeleton from "../common/ListSkeleton";
import { useConversations } from "../../hooks/useChatbot";
import { timeAgo } from "../../utils/format";

export default function ChatHistory({ opening, onOpen }) {
  const { data, isPending, isError, error } = useConversations(true);
  const items = data ?? [];

  if (isPending)
    return (
      <div className="flex-1 overflow-y-auto bg-page p-3">
        <ListSkeleton rows={4} />
      </div>
    );
  if (isError)
    return (
      <p role="alert" className="flex-1 bg-page p-6 text-center text-sm text-danger">
        {error.message}
      </p>
    );
  if (items.length === 0)
    return (
      <div className="flex-1 bg-page">
        <EmptyState title="Chưa có cuộc trò chuyện" description="Bắt đầu chat để nhận gợi ý khóa học phù hợp." />
      </div>
    );

  return (
    <ul className="flex-1 overflow-y-auto bg-page">
      {items.map((conversation) => (
        <li key={conversation.id}>
          <button
            type="button"
            disabled={opening}
            onClick={() => onOpen(conversation.id)}
            className="flex min-h-11 w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
          >
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
              <MessagesSquare size={16} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink-strong">{conversation.firstMessage ?? "Cuộc trò chuyện mới"}</span>
              <span className="text-xs text-muted">
                {timeAgo(conversation.startTime)} · {conversation.messageCount} tin nhắn
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
