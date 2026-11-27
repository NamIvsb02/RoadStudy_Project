import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DashboardPanel from "../../components/common/DashboardPanel";
import NoteDialog from "../../components/common/NoteDialog";
import Pagination from "../../components/common/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import { formatDate, formatVND } from "../../utils/format";
import AdminCourseActions from "./course/AdminCourseActions";
import { CONFIRMS, runAction } from "./course/courseActions";
import { TABLE, TBODY, TD, TD_ACTION, TH, TR } from "../manage/tableStyles";
import StatusTabs from "../manage/StatusTabs";
import SearchField from "../manage/SearchField";
import ActionError from "../manage/ActionError";

const LIMIT = 10;
const TABS = [["", "Tất cả"], ...Object.entries(STATUS_MAPS.CourseStatus).map(([value, { label }]) => [value, label])];

export default function AdminCoursesPage() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState(STATUS_MAPS.CourseStatus[params.get("status")] ? params.get("status") : "");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const request = useCallback(
    () =>
      courseApi.getAdminList({
        ...(status && { status }),
        ...(search && { q: search }),
        page,
        limit: LIMIT,
      }),
    [status, search, page],
  );
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];
  const isReject = action?.key === "reject";
  const confirm = action && !isReject ? CONFIRMS[action.key] : null;

  const handleTab = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
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

  const handleReject = async (reason) => {
    await runAction(action.course, "reject", reason);
    setActionError("");
    setAction(null);
    reload();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <StatusTabs tabs={TABS} value={status} onChange={handleTab} />
        <SearchField placeholder="Tìm tên khóa học, nhấn Enter" label="Tìm khóa học" onSearch={handleSearch} />
      </div>
      <ActionError message={actionError} />
      <DashboardPanel title="Khóa học" skeleton="table" flush loading={loading} error={error} empty={items.length === 0} emptyText="Không có khóa học nào phù hợp.">
        <table className={`${TABLE} min-w-[900px]`}>
          <thead>
            <tr>
              <th className={TH}>Khóa học</th>
              <th className={TH}>Giáo viên</th>
              <th className={TH}>Học phí</th>
              <th className={TH}>Thời gian</th>
              <th className={TH}>Trạng thái</th>
              <th className={TH} />
            </tr>
          </thead>
          <tbody className={TBODY}>
            {items.map((course) => (
              <tr key={course.id} className={TR}>
                <td className={TD}>
                  <p className="font-medium">{course.courseName}</p>
                  {course.category && <p className="text-xs text-muted">{course.category.categoryName}</p>}
                </td>
                <td className={TD}>{course.teacher?.account?.fullName ?? "–"}</td>
                <td className={TD}>{Number(course.price) === 0 ? "Miễn phí" : formatVND(course.price)}</td>
                <td className={TD}>
                  {formatDate(course.startDate)} - {formatDate(course.endDate)}
                </td>
                <td className={TD}>
                  <StatusBadge type="CourseStatus" value={course.status} />
                </td>
                <td className={TD_ACTION}>
                  <AdminCourseActions course={course} busy={busy} onAction={(item, key) => setAction({ course: item, key })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardPanel>
      <Pagination pagination={data?.pagination} onChange={setPage} />
      <NoteDialog
        open={isReject}
        title={`Từ chối khóa học${action ? `: ${action.course.courseName}` : ""}`}
        label="Lý do từ chối"
        confirmLabel="Từ chối"
        danger
        maxLength={500}
        onSubmit={handleReject}
        onCancel={() => setAction(null)}
      />
      <ConfirmDialog
        open={Boolean(action) && !isReject}
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
