import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DashboardPanel from "../../components/common/DashboardPanel";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import { formatDate, formatVND } from "../../utils/format";
import AdminCourseActions from "./course/AdminCourseActions";
import { CONFIRMS, runAction } from "./course/courseActions";

const LIMIT = 10;
const TABS = [["", "Tất cả"], ...Object.entries(STATUS_MAPS.CourseStatus).map(([value, { label }]) => [value, label])];
const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";

export default function AdminCoursesPage() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState(STATUS_MAPS.CourseStatus[params.get("status")] ? params.get("status") : "");
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const request = useCallback(() => courseApi.getAdminList({ ...(status && { status }), ...(search && { q: search }), page, limit: LIMIT }), [status, search, page]);
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];
  const confirm = action ? CONFIRMS[action.key] : null;

  const handleTab = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(keyword.trim());
    setPage(1);
  };

  const handleConfirm = async () => {
    const { course, key } = action;
    setAction(null);
    setBusy(true);
    setActionError("");
    try {
      await runAction(course, key);
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
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
      <form role="search" onSubmit={handleSearch}>
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm tên khóa học, nhấn Enter"
          aria-label="Tìm khóa học"
          className="h-10 w-full max-w-md rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/30"
        />
      </form>
      {actionError && (
        <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {actionError}
        </p>
      )}
      <DashboardPanel title="Khóa học" loading={loading} error={error} empty={items.length === 0} emptyText="Không có khóa học nào phù hợp.">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr>
              <th className={th}>Khóa học</th>
              <th className={th}>Giáo viên</th>
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
                <td className={td}>{course.teacher?.account?.fullName ?? "–"}</td>
                <td className={td}>{Number(course.price) === 0 ? "Miễn phí" : formatVND(course.price)}</td>
                <td className={td}>
                  {formatDate(course.startDate)} - {formatDate(course.endDate)}
                </td>
                <td className={td}>
                  <StatusBadge type="CourseStatus" value={course.status} />
                </td>
                <td className={td}>
                  <AdminCourseActions course={course} busy={busy} onAction={(item, key) => setAction({ course: item, key })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardPanel>
      <Pagination page={page} totalPages={data?.pagination.totalPages} onChange={setPage} />
      <ConfirmDialog
        open={Boolean(action)}
        title={confirm?.title}
        message={action ? `${action.course.courseName}. ${confirm.message}` : ""}
        confirmLabel={confirm?.label}
        danger={confirm?.danger}
        onConfirm={handleConfirm}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}
