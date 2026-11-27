import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { enrollmentApi } from "../../api/enrollmentApi";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import ListSkeleton from "../../components/common/ListSkeleton";
import Pagination from "../../components/common/Pagination";
import RevealGroup from "../../components/common/RevealGroup";
import { ROUTES } from "../../constants/routes";
import { STATUS_MAPS } from "../../constants/statuses";
import { tabIndicator } from "../../constants/motion";
import { useFetch } from "../../hooks/useFetch";
import MyCourseCard from "./MyCourseCard";

const LIMIT = 9;
const TABS = [["", "Tất cả"], ...Object.entries(STATUS_MAPS.RegistrationStatus).map(([value, { label }]) => [value, label])];

export default function MyCoursesPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const request = useCallback(() => enrollmentApi.getMine({ ...(status && { status }), page, limit: LIMIT }), [status, page]);
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];

  const handleTab = (value) => {
    setStatus(value);
    setPage(1);
  };

  let body;
  if (loading) body = <ListSkeleton rows={3} />;
  else if (error) body = <ErrorState message={error} onRetry={reload} />;
  else if (items.length === 0) {
    body = (
      <EmptyState
        title="Chưa có khóa học nào"
        description="Bạn chưa đăng ký khóa học nào trong mục này."
        action={
          <Link to={ROUTES.COURSES} className="inline-flex h-11 items-center text-sm font-semibold text-primary hover:underline">
            Khám phá khóa học
          </Link>
        }
      />
    );
  } else {
    body = (
      <RevealGroup key={`${status}-${page}`} trigger="mount" className="flex flex-col gap-4">
        {items.map((registration) => (
          <MyCourseCard key={registration.id} registration={registration} />
        ))}
      </RevealGroup>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-ink">Khóa học của tôi</h1>
      <div role="group" aria-label="Lọc theo trạng thái" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
        {TABS.map(([value, label]) => {
          const active = status === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => handleTab(value)}
              className={`relative h-11 shrink-0 rounded-lg px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light ${active ? "text-primary" : "text-muted hover:text-ink"}`}
            >
              {active && <motion.span layoutId="my-courses-tab" transition={tabIndicator} className="absolute inset-0 rounded-lg bg-primary-50" />}
              <span className="relative">{label}</span>
            </button>
          );
        })}
      </div>
      {body}
      {status === "" && items.length > 0 && (
        <Link to={ROUTES.COURSES} className="inline-flex h-11 items-center self-start text-sm font-semibold text-primary hover:underline">
          Xem thêm khóa học
        </Link>
      )}
      <Pagination pagination={data?.pagination} onChange={setPage} />
    </div>
  );
}
