import { Link } from "react-router-dom";
import DashboardPanel from "../../../components/common/DashboardPanel";
import StatusBadge from "../../../components/ui/StatusBadge";
import { ROUTES } from "../../../constants/routes";
import { TABLE, TBODY, TD, TH, TR } from "../../manage/tableStyles";

const linkClass =
  "inline-flex min-h-11 items-center rounded-lg px-4 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light";

export default function MyCoursesPanel({ items, loading }) {
  return (
    <DashboardPanel
      title="Khóa học của tôi"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link to={ROUTES.TEACHER.COURSE_NEW} className={`${linkClass} bg-primary text-white hover:bg-primary-dark`}>
            Tạo khóa học
          </Link>
          <Link to={ROUTES.TEACHER.EXAMS} className={`${linkClass} border border-line bg-white text-ink hover:bg-primary-50`}>
            Tạo đề thi
          </Link>
        </div>
      }
      skeleton="table"
      flush
      loading={loading}
      empty={items.length === 0}
      emptyText="Bạn chưa có khóa học nào."
    >
      <table className={`${TABLE} min-w-[360px]`}>
        <thead>
          <tr>
            <th className={TH}>Khóa học</th>
            <th className={TH}>Trạng thái</th>
            <th className={TH}>Đề thi</th>
          </tr>
        </thead>
        <tbody className={TBODY}>
          {items.map((course) => (
            <tr key={course.id} className={TR}>
              <td className={TD}>{course.courseName}</td>
              <td className={TD}>
                <StatusBadge type="CourseStatus" value={course.status} />
              </td>
              <td className={TD}>{course.examCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardPanel>
  );
}
