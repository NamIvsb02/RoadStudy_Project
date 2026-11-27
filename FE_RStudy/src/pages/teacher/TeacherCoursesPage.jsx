import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DashboardPanel from "../../components/common/DashboardPanel";
import Pagination from "../../components/common/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import { ROUTES } from "../../constants/routes";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import { formatDate, formatVND } from "../../utils/format";
import CourseActions from "./course/CourseActions";
import { TABLE, TBODY, TD, TD_ACTION, TH, TR } from "../manage/tableStyles";
import ActionError from "../manage/ActionError";
import StatusTabs from "../manage/StatusTabs";

const LIMIT = 10;
const TABS = [["", "Tất cả"], ...Object.entries(STATUS_MAPS.CourseStatus).map(([value, { label }]) => [value, label])];

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
      <StatusTabs tabs={TABS} value={status} onChange={handleTab} />
      <ActionError message={actionError} />
      <DashboardPanel
        title="Khóa học của tôi"
        actions={
          <Link
            to={ROUTES.TEACHER.COURSE_NEW}
            className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
          >
            Tạo khóa học
          </Link>
        }
        skeleton="table"
        flush
        loading={loading}
        error={error}
        empty={items.length === 0}
        emptyText="Chưa có khóa học nào trong mục này."
      >
        <table className={`${TABLE} min-w-[760px]`}>
          <thead>
            <tr>
              <th className={TH}>Khóa học</th>
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
                <td className={TD}>{Number(course.price) === 0 ? "Miễn phí" : formatVND(course.price)}</td>
                <td className={TD}>
                  {formatDate(course.startDate)} - {formatDate(course.endDate)}
                </td>
                <td className={TD}>
                  <StatusBadge type="CourseStatus" value={course.status} />
                </td>
                <td className={TD_ACTION}>
                  <CourseActions course={course} busy={busy} onSubmitForApproval={setTarget} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardPanel>
      <Pagination pagination={data?.pagination} onChange={setPage} />
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
