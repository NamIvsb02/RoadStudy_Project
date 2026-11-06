import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Chưa có dữ liệu", description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-surface text-muted">
        <Inbox size={24} />
      </span>
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}
