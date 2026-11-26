import { Link, generatePath } from "react-router-dom";
import DashboardPanel from "../../../components/common/DashboardPanel";
import ResultBadge from "../../../components/common/ResultBadge";
import { ROUTES } from "../../../constants/routes";
import { formatDateTime } from "../../../utils/format";
import { durationBetween, formatDuration, formatScore } from "../examFormat";

const th = "bg-primary/5 px-3 py-3 text-left text-xs font-semibold tracking-wide text-muted uppercase";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";

export default function AttemptHistory({ items, loading, error }) {
  return (
    <DashboardPanel title="Lịch sử làm bài" loading={loading} error={error} empty={items.length === 0} emptyText="Bạn chưa làm đề này lần nào.">
      <table className="w-full min-w-[560px]">
        <thead>
          <tr>
            <th className={th}>Ngày thi</th>
            <th className={th}>Thời gian làm bài</th>
            <th className={th}>Điểm</th>
            <th className={th}>Kết quả</th>
            <th className={th}>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {items.map((attempt) => {
            const seconds = durationBetween(attempt.startTime, attempt.endTime);
            return (
              <tr key={attempt.id} className="hover:bg-primary-50/50">
                <td className={td}>{formatDateTime(attempt.startTime)}</td>
                <td className={td}>{seconds === null ? "–" : formatDuration(seconds)}</td>
                <td className={td}>{formatScore(attempt.score)}</td>
                <td className={td}>
                  <ResultBadge passed={attempt.passed} status={attempt.status} />
                </td>
                <td className={td}>
                  <Link to={generatePath(ROUTES.ATTEMPT_DETAIL, { id: attempt.id })} className="inline-flex min-h-11 items-center text-xs font-semibold text-primary hover:underline">
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </DashboardPanel>
  );
}
