import { Link, generatePath } from "react-router-dom";
import ResultBadge from "../../../components/common/ResultBadge";
import { ROUTES } from "../../../constants/routes";
import { formatDateTime } from "../../../utils/format";
import { formatScore } from "../../exam/examFormat";
import { ACTION_LINK, TABLE, TBODY, TD, TD_ACTION, TH, TR } from "../../manage/tableStyles";

export default function SubmissionTable({ items, showCourse }) {
  return (
    <table className={`${TABLE} min-w-[760px]`}>
      <thead>
        <tr>
          <th className={TH}>Học viên</th>
          {showCourse && <th className={TH}>Khóa học</th>}
          <th className={TH}>Đề thi</th>
          <th className={TH}>Bắt đầu</th>
          <th className={TH}>Điểm</th>
          <th className={TH}>Kết quả</th>
          <th className={TH} />
        </tr>
      </thead>
      <tbody className={TBODY}>
        {items.map((attempt) => (
          <tr key={attempt.id} className={TR}>
            <td className={TD}>
              <p className="font-medium">{attempt.student.account.fullName}</p>
              <p className="text-xs text-muted">{attempt.student.account.email}</p>
            </td>
            {showCourse && <td className={TD}>{attempt.course.courseName}</td>}
            <td className={TD}>{attempt.examName}</td>
            <td className={TD}>{formatDateTime(attempt.startTime)}</td>
            <td className={TD}>{formatScore(attempt.score)}</td>
            <td className={TD}>
              <ResultBadge passed={attempt.passed} status={attempt.status} />
            </td>
            <td className={TD_ACTION}>
              <Link to={generatePath(ROUTES.TEACHER.ATTEMPT, { id: attempt.id })} className={ACTION_LINK}>
                Xem chi tiết
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
