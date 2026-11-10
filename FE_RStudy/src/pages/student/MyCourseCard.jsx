import { generatePath, Link } from "react-router-dom";
import { Ban, Receipt, Undo2, Upload } from "lucide-react";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import { ROUTES } from "../../constants/routes";
import { assetUrl, formatDate, formatVND } from "../../utils/format";
import { getPaymentState } from "../../utils/paymentState";
import { isWithinRefundWindow } from "../../utils/refund";

const PAY_BUTTON = {
  AWAITING: { label: "Thanh toán", icon: Upload },
  REJECTED: { label: "Gửi lại minh chứng", icon: Upload },
  REVIEWING: { label: "Xem thanh toán", icon: Receipt },
  PAID: { label: "Xem hóa đơn", icon: Receipt },
};

export default function MyCourseCard({ registration, pendingRefund, onOpenPayment, onCancel, onRefund }) {
  const { course, invoice } = registration;
  const state = getPaymentState(registration.status, invoice);
  const payButton = state ? PAY_BUTTON[state] : null;
  const canCancel = state === "AWAITING" || state === "REJECTED";
  const canRefundCancel = state === "REVIEWING" && !pendingRefund;
  const canRefundPaid = state === "PAID" && !pendingRefund && isWithinRefundWindow(invoice.paidAt);
  const cover = assetUrl(course.coverImageUrl);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-card">
      {cover ? <img src={cover} alt={course.courseName} className="h-40 w-full object-cover" /> : <div className="h-40 w-full bg-surface" />}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link to={generatePath(ROUTES.COURSE_DETAIL, { id: course.id })} className="line-clamp-2 font-semibold text-ink transition-colors hover:text-primary">
          {course.courseName}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge type="RegistrationStatus" value={registration.status} />
          {invoice && invoice.status !== registration.status && <StatusBadge type="InvoiceStatus" value={invoice.status} />}
        </div>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Ngày đăng ký</dt>
            <dd className="text-ink">{formatDate(registration.registeredAt)}</dd>
          </div>
          {invoice && (
            <div className="flex justify-between">
              <dt className="text-muted">Số tiền</dt>
              <dd className="font-medium text-ink">{formatVND(invoice.totalAmount)}</dd>
            </div>
          )}
        </dl>
        {pendingRefund && <p className="rounded-lg bg-info/10 px-3 py-2 text-xs text-info">Yêu cầu hoàn tiền đang được xử lý</p>}
        <div className="mt-auto flex flex-wrap gap-2">
          {payButton && (
            <Button variant={state === "AWAITING" || state === "REJECTED" ? "primary" : "outline"} onClick={() => onOpenPayment(registration.id)}>
              <payButton.icon size={16} />
              {payButton.label}
            </Button>
          )}
          {canCancel && (
            <Button variant="secondary" onClick={() => onCancel(registration.id)}>
              <Ban size={16} />
              Hủy đăng ký
            </Button>
          )}
          {canRefundCancel && (
            <Button variant="secondary" onClick={() => onRefund(invoice.id, "CANCEL")}>
              <Undo2 size={16} />
              Hủy và hoàn tiền
            </Button>
          )}
          {canRefundPaid && (
            <Button variant="secondary" onClick={() => onRefund(invoice.id, "PAID")}>
              <Undo2 size={16} />
              Yêu cầu hoàn tiền
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
