import { Link, generatePath } from "react-router-dom";
import ResultBadge from "../../../components/common/ResultBadge";
import { ROUTES } from "../../../constants/routes";
import { formatDateTime } from "../../../utils/format";
import { formatScore } from "../../exam/examFormat";

const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";

export default function SubmissionTable({ items, showCourse }) {
  return (
    <table className="w-full min-w-[760px]">
      <thead>
        <tr>
          <th className={th}>Học viên</th>
          {showCourse && <th className={th}>Khóa học</th>}
          <th className={th}>Đề thi</th>
          <th className={th}>Bắt đầu</th>
          <th className={th}>Điểm</th>
          <th className={th}>Kết quả</th>
          <th className={th} />
        </tr>
      </thead>
      <tbody>
        {items.map((attempt) => (
          <tr key={attempt.id}>
            <td className={td}>
              <p className="font-medium">{attempt.student.account.fullName}</p>
              <p className="text-xs text-muted">{attempt.student.account.email}</p>
            </td>
            {showCourse && <td className={td}>{attempt.course.courseName}</td>}
            <td className={td}>{attempt.examName}</td>
            <td className={td}>{formatDateTime(attempt.startTime)}</td>
            <td className={td}>{formatScore(attempt.score)}</td>
            <td className={td}>
              <ResultBadge passed={attempt.passed} status={attempt.status} />
            </td>
            <td className={td}>
              <Link to={generatePath(ROUTES.TEACHER.ATTEMPT, { id: attempt.id })} className="text-xs font-semibold text-primary hover:underline">
                Xem chi tiết
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
