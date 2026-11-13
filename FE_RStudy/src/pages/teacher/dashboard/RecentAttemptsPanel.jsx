import DashboardPanel from "../../../components/common/DashboardPanel";
import StatusBadge from "../../../components/ui/StatusBadge";

const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";

function ResultBadge({ attempt }) {
  if (attempt.passed === null) return <StatusBadge type="AttemptStatus" value={attempt.status} />;
  const tone = attempt.passed ? "bg-success/10 text-success" : "bg-danger/10 text-danger";
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${tone}`}>{attempt.passed ? "Đạt" : "Chưa đạt"}</span>;
}

export default function RecentAttemptsPanel({ items, loading }) {
  return (
    <DashboardPanel title="Bài làm gần đây" loading={loading} empty={items.length === 0} emptyText="Chưa có học viên nào làm bài.">
      <table className="w-full min-w-[480px]">
        <thead>
          <tr>
            <th className={th}>Học viên</th>
            <th className={th}>Đề thi</th>
            <th className={th}>Điểm</th>
            <th className={th}>Kết quả</th>
          </tr>
        </thead>
        <tbody>
          {items.map((attempt) => (
            <tr key={attempt.id}>
              <td className={td}>{attempt.studentName}</td>
              <td className={td}>{attempt.examName}</td>
              <td className={td}>{attempt.score === null ? "–" : Number(attempt.score).toLocaleString("vi-VN")}</td>
              <td className={td}>
                <ResultBadge attempt={attempt} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardPanel>
  );
}
