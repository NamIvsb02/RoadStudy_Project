import { Loader2 } from "lucide-react";

export default function LoadingState({ label = "Đang tải..." }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 px-4 py-12 text-sm text-muted">
      <Loader2 size={20} className="animate-spin" />
      {label}
    </div>
  );
}
