import Button from "../../../components/ui/Button";
import StatusBadge from "../../../components/ui/StatusBadge";
import { formatDateTime, formatVND } from "../../../utils/format";

export default function RefundCard({ request, busy, onApprove, onComplete, onReject }) {
  const { student, registration, invoice } = request;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusBadge type="SupportRequestStatus" value={request.status} />
        <span className="text-xs text-muted">{formatDateTime(request.createdAt)}</span>
      </div>
      <div>
        <p className="font-semibold text-ink">{registration.course.courseName}</p>
        <p className="text-sm text-muted">
          {student.account.fullName} ({student.account.email}) · {formatVND(invoice?.totalAmount)}
        </p>
      </div>
      <p className="rounded-lg bg-soft p-3 text-sm whitespace-pre-line text-ink">{request.description}</p>
      {request.adminNote && (
        <p className="text-sm text-ink">
          <span className="font-medium">Ghi chú xử lý:</span> {request.adminNote}
        </p>
      )}
      {request.status === "CHO_XU_LY" && (
        <div className="flex flex-wrap gap-2">
          <Button disabled={busy} onClick={() => onApprove(request)}>
            Chấp thuận
          </Button>
          <Button variant="secondary" disabled={busy} onClick={() => onReject(request)}>
            Từ chối
          </Button>
        </div>
      )}
      {request.status === "CHO_HOAN_TIEN" && (
        <div>
          <Button disabled={busy} onClick={() => onComplete(request)}>
            Đã hoàn tiền xong
          </Button>
        </div>
      )}
    </article>
  );
}
