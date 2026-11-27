import Skeleton from "../ui/Skeleton";

export const COURSE_GRID_CLASS = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

function Card() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border border-line bg-white">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-4/5" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export default function CourseCardSkeleton({ count = 1, className = COURSE_GRID_CLASS }) {
  return (
    <div role="status" className={className}>
      <span className="sr-only">Đang tải</span>
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} />
      ))}
    </div>
  );
}
