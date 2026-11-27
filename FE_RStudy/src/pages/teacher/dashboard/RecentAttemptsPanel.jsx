import DashboardPanel from "../../../components/common/DashboardPanel";
import ResultBadge from "../../../components/common/ResultBadge";
import { TABLE, TBODY, TD, TH, TR } from "../../manage/tableStyles";

export default function RecentAttemptsPanel({ items, loading }) {
  return (
    <DashboardPanel title="Bài làm gần đây" skeleton="table" flush loading={loading} empty={items.length === 0} emptyText="Chưa có học viên nào làm bài.">
      <table className={`${TABLE} min-w-[480px]`}>
        <thead>
          <tr>
            <th className={TH}>Học viên</th>
            <th className={TH}>Đề thi</th>
            <th className={TH}>Điểm</th>
            <th className={TH}>Kết quả</th>
          </tr>
        </thead>
        <tbody className={TBODY}>
          {items.map((attempt) => (
            <tr key={attempt.id} className={TR}>
              <td className={TD}>{attempt.studentName}</td>
              <td className={TD}>{attempt.examName}</td>
              <td className={TD}>{attempt.score === null ? "–" : Number(attempt.score).toLocaleString("vi-VN")}</td>
              <td className={TD}>
                <ResultBadge passed={attempt.passed} status={attempt.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardPanel>
  );
}
