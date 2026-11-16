import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { enrollmentApi } from "../../api/enrollmentApi";
import DashboardPanel from "../../components/common/DashboardPanel";
import Pagination from "../../components/ui/Pagination";
import { ROUTES } from "../../constants/routes";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import MyCourseCard from "./MyCourseCard";

const LIMIT = 9;
const TABS = [["", "Tất cả"], ...Object.entries(STATUS_MAPS.RegistrationStatus).map(([value, { label }]) => [value, label])];

export default function MyCoursesPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const request = useCallback(() => enrollmentApi.getMine({ ...(status && { status }), page, limit: LIMIT }), [status, page]);
  const { data, loading, error } = useFetch(request);
  const items = data?.items ?? [];

  const handleTab = (value) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-ink">Khóa học của tôi</h1>
      <div role="tablist" className="flex flex-wrap gap-2">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={status === value}
            onClick={() => handleTab(value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${status === value ? "bg-primary text-white" : "bg-white text-ink hover:bg-soft"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <DashboardPanel title="Danh sách khóa học" loading={loading} error={error} empty={items.length === 0} emptyText="Bạn chưa đăng ký khóa học nào trong mục này.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((registration) => (
            <MyCourseCard key={registration.id} registration={registration} />
          ))}
        </div>
        {status === "" && (
          <Link to={ROUTES.COURSES} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
            Xem thêm khóa học
          </Link>
        )}
      </DashboardPanel>
      <Pagination page={page} totalPages={data?.pagination.totalPages} onChange={setPage} />
    </div>
  );
}
