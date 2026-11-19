import { Link, generatePath } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge";
import { ROUTES } from "../../constants/routes";
import { formatVND } from "../../utils/format";

const linkClass = "inline-flex h-11 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors";
const primaryClass = `${linkClass} bg-primary text-white hover:bg-primary-dark`;
const secondaryClass = `${linkClass} border border-line text-ink hover:bg-primary/10`;

export default function EnrolledNotice({ registration, course }) {
  const paid = registration.status === "DA_THANH_TOAN";
  const paymentTo = generatePath(ROUTES.PAYMENT, { id: registration.id });
  const amount = paid ? registration.amountPaid : course.price;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-2xl font-bold text-primary">{Number(amount) === 0 ? "Miễn phí" : formatVND(amount)}</p>
        <StatusBadge type="RegistrationStatus" value={registration.status} />
      </div>
      <p className="text-sm text-muted">{paid ? "Bạn đã đăng ký khóa học này." : "Bạn đã đăng ký khóa học này, đang chờ thanh toán."}</p>
      {paid ? (
        <>
          <Link to={ROUTES.EXAMS} className={primaryClass}>
            Làm bài thi
          </Link>
          <Link to={paymentTo} className={secondaryClass}>
            Xem hóa đơn
          </Link>
        </>
      ) : (
        <Link to={paymentTo} className={primaryClass}>
          Tiếp tục thanh toán
        </Link>
      )}
    </div>
  );
}
