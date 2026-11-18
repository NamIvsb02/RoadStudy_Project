import { Link } from "react-router-dom";
import DashboardPanel from "../../../components/common/DashboardPanel";
import StatusBadge from "../../../components/ui/StatusBadge";
import { ROUTES } from "../../../constants/routes";

const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";
const linkClass = "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors";

export default function MyCoursesPanel({ items, loading }) {
  return (
    <DashboardPanel title="Khóa học của tôi" loading={loading} empty={items.length === 0} emptyText="Bạn chưa có khóa học nào.">
      <table className="w-full min-w-[360px]">
        <thead>
          <tr>
            <th className={th}>Khóa học</th>
            <th className={th}>Trạng thái</th>
            <th className={th}>Đề thi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((course) => (
            <tr key={course.id}>
              <td className={td}>{course.courseName}</td>
              <td className={td}>
                <StatusBadge type="CourseStatus" value={course.status} />
              </td>
              <td className={td}>{course.examCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2">
        <Link to={ROUTES.TEACHER.COURSES} className={`${linkClass} bg-primary text-white hover:bg-primary-dark`}>
          Tạo khóa học
        </Link>
        <Link to={ROUTES.TEACHER.EXAMS} className={`${linkClass} bg-soft text-primary hover:bg-primary/10`}>
          Tạo đề thi
        </Link>
      </div>
    </DashboardPanel>
  );
}
