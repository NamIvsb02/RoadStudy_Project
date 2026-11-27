import Skeleton from "../ui/Skeleton";

export default function ListSkeleton({ rows = 4 }) {
  return (
    <div role="status" className="space-y-3">
      <span className="sr-only">Đang tải</span>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} aria-hidden="true" className="flex items-center gap-4 rounded-xl border border-line bg-white p-4">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
