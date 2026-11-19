import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DashboardPanel from "../../components/common/DashboardPanel";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import { ROUTES } from "../../constants/routes";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import { formatDate, formatVND } from "../../utils/format";
import CourseActions from "./course/CourseActions";

const LIMIT = 10;
const TABS = [["", "Tất cả"], ...Object.entries(STATUS_MAPS.CourseStatus).map(([value, { label }]) => [value, label])];
const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";

export default function TeacherCoursesPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const request = useCallback(() => courseApi.getMine({ ...(status && { status }), page, limit: LIMIT }), [status, page]);
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];

  const handleTab = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleSubmit = async () => {
    const course = target;
    setTarget(null);
    setBusy(true);
    setActionError("");
    try {
      await courseApi.submit(course.id);
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <Link to={ROUTES.TEACHER.COURSE_NEW} className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
          Tạo khóa học
        </Link>
      </div>
      {actionError && (
        <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {actionError}
        </p>
      )}
      <DashboardPanel title="Khóa học của tôi" loading={loading} error={error} empty={items.length === 0} emptyText="Chưa có khóa học nào trong mục này.">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr>
              <th className={th}>Khóa học</th>
              <th className={th}>Học phí</th>
              <th className={th}>Thời gian</th>
              <th className={th}>Trạng thái</th>
              <th className={th} />
            </tr>
          </thead>
          <tbody>
            {items.map((course) => (
              <tr key={course.id}>
                <td className={td}>
                  <p className="font-medium">{course.courseName}</p>
                  {course.category && <p className="text-xs text-muted">{course.category.categoryName}</p>}
                </td>
                <td className={td}>{Number(course.price) === 0 ? "Miễn phí" : formatVND(course.price)}</td>
                <td className={td}>
                  {formatDate(course.startDate)} - {formatDate(course.endDate)}
                </td>
                <td className={td}>
                  <StatusBadge type="CourseStatus" value={course.status} />
                </td>
                <td className={td}>
                  <CourseActions course={course} busy={busy} onSubmitForApproval={setTarget} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardPanel>
      <Pagination page={page} totalPages={data?.pagination.totalPages} onChange={setPage} />
      <ConfirmDialog
        open={Boolean(target)}
        title="Gửi duyệt khóa học?"
        message={target ? `${target.courseName}. Sau khi gửi bạn không sửa được cho đến khi admin xử lý.` : ""}
        confirmLabel="Gửi duyệt"
        onConfirm={handleSubmit}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
