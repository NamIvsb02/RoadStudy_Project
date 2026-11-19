import Button from "../../../components/ui/Button";
import StatusBadge from "../../../components/ui/StatusBadge";
import { formatDateTime } from "../../../utils/format";

const TARGETS = {
  review: { label: "Đánh giá", statusType: "ReviewStatus" },
  comment: { label: "Bình luận", statusType: "ContentStatus" },
  reply: { label: "Phản hồi", statusType: "ContentStatus" },
};

const getTarget = (report) => {
  const key = Object.keys(TARGETS).find((name) => report[name]);
  return key ? { ...TARGETS[key], data: report[key] } : null;
};

export default function ReportCard({ report, busy, onStart, onResolve, onReject }) {
  const target = getTarget(report);
  const open = report.status === "CHO_XU_LY" || report.status === "DANG_XU_LY";

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusBadge type="ReportStatus" value={report.status} />
        <span className="text-xs text-muted">{formatDateTime(report.reportedAt)}</span>
      </div>
      <div>
        <p className="font-semibold text-ink">{report.reason}</p>
        <p className="mt-1 whitespace-pre-line text-sm text-muted">{report.content}</p>
      </div>
      <p className="text-xs text-muted">
        Người báo cáo: {report.reporter.email} · Người bị báo cáo: {report.reportedAccount?.email ?? "không rõ"}
      </p>
      {target && (
        <div className="rounded-lg bg-soft p-3">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
            {target.label}
            <StatusBadge type={target.statusType} value={target.data.status} />
            {target.data.rating != null && <span className="text-muted">{target.data.rating}/5 sao</span>}
          </div>
          <p className="whitespace-pre-line text-sm text-ink">{target.data.content || "(không có nội dung)"}</p>
        </div>
      )}
      {report.resolutionResult && (
        <p className="text-sm text-ink">
          <span className="font-medium">Kết quả xử lý:</span> {report.resolutionResult}
        </p>
      )}
      {open && (
        <div className="flex flex-wrap gap-2">
          {report.status === "CHO_XU_LY" ? (
            <Button disabled={busy} onClick={() => onStart(report)}>
              Nhận xử lý
            </Button>
          ) : (
            <Button disabled={busy} onClick={() => onResolve(report)}>
              Xác nhận vi phạm
            </Button>
          )}
          <Button variant="secondary" disabled={busy} onClick={() => onReject(report)}>
            Từ chối
          </Button>
        </div>
      )}
    </article>
  );
}
