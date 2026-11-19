import { Link, generatePath } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge";
import { ROUTES } from "../../constants/routes";
import { formatVND } from "../../utils/format";

export default function PaymentSummary({ registration }) {
  const { course, invoice, status } = registration;
  const discount = Number(invoice?.discountAmountApplied ?? 0);

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted">Khóa học</p>
          <Link to={generatePath(ROUTES.COURSE_DETAIL, { id: course.id })} className="text-lg font-semibold text-primary hover:underline">
            {course.courseName}
          </Link>
        </div>
        <StatusBadge type="RegistrationStatus" value={status} />
      </div>
      <dl className="mt-4 text-sm">
        <div className="flex justify-between py-1">
          <dt className="text-muted">Học phí</dt>
          <dd>{formatVND(invoice?.subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between py-1">
            <dt className="text-muted">Giảm giá</dt>
            <dd>-{formatVND(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-line pt-2 font-semibold">
          <dt>Cần thanh toán</dt>
          <dd className="text-primary">{formatVND(invoice?.totalAmount)}</dd>
        </div>
      </dl>
    </section>
  );
}
