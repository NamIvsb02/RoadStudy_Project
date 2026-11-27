import Skeleton from "../ui/Skeleton";

export default function PageSkeleton() {
  return (
    <div role="status" className="space-y-4">
      <span className="sr-only">Đang tải</span>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <div aria-hidden="true" className="grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="hidden h-40 lg:block" />
      </div>
    </div>
  );
}
