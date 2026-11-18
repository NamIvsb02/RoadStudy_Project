import StatusBadge from "../ui/StatusBadge";

export default function ResultBadge({ passed, status }) {
  if (passed === null || passed === undefined) return <StatusBadge type="AttemptStatus" value={status} />;
  const tone = passed ? "bg-success/10 text-success" : "bg-danger/10 text-danger";

  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${tone}`}>{passed ? "Đạt" : "Chưa đạt"}</span>;
}
