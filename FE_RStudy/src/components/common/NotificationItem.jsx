import { timeAgo } from "../../utils/format";

export default function NotificationItem({ item, onSelect }) {
  return (
    <li>
      <button type="button" onClick={() => onSelect(item)} className={`flex w-full gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-surface focus-visible:bg-surface ${item.isRead ? "" : "bg-primary/5"}`}>
        <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 rounded-full ${item.isRead ? "bg-transparent" : "bg-primary"}`} />
        <span className="min-w-0 flex-1">
          <span className={`block text-sm text-ink ${item.isRead ? "" : "font-semibold"}`}>{item.title}</span>
          {item.body && <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{item.body}</span>}
          <span className="mt-1 block text-xs text-muted">{timeAgo(item.createdAt)}</span>
        </span>
      </button>
    </li>
  );
}
