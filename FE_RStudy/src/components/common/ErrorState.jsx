import { TriangleAlert } from "lucide-react";
import Button from "../ui/Button";

export default function ErrorState({ message = "Đã có lỗi xảy ra", onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        <TriangleAlert size={24} />
      </span>
      <p className="max-w-sm text-sm text-ink">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}
