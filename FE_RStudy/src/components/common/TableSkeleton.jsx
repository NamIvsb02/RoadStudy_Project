import Skeleton from "../ui/Skeleton";

export default function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div role="status" className="overflow-hidden rounded-xl border border-line bg-white">
      <span className="sr-only">Đang tải</span>
      <div aria-hidden="true" className="flex gap-4 border-b border-line bg-primary/5 px-3 py-3">
        {Array.from({ length: cols }, (_, col) => (
          <Skeleton key={col} className="h-3 flex-1 bg-line" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} aria-hidden="true" className="flex gap-4 border-b border-line px-3 py-3.5 last:border-b-0">
          {Array.from({ length: cols }, (_, col) => (
            <Skeleton key={col} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
