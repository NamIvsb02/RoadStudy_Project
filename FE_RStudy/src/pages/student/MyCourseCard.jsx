import { Link, generatePath } from "react-router-dom";
import CourseCover from "../../components/common/CourseCover";
import StatusBadge from "../../components/ui/StatusBadge";
import { ROUTES } from "../../constants/routes";
import { formatDate, formatVND } from "../../utils/format";

const buttonBase =
  "inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light";
const primaryClass = `${buttonBase} bg-primary text-white hover:bg-primary-dark`;
const secondaryClass = `${buttonBase} border border-line bg-white text-ink hover:border-line-strong hover:bg-primary/10`;
const linkClass = "inline-flex h-11 items-center text-sm font-semibold text-primary hover:underline";

export default function MyCourseCard({ registration }) {
  const { course, status } = registration;
  const price = status === "DA_THANH_TOAN" ? registration.amountPaid : course.price;
  const paymentPath = generatePath(ROUTES.PAYMENT, { id: registration.id });

  return (
    <article className="group isolate flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow duration-200 ease-out-soft hover:shadow-card-hover sm:flex-row">
      <CourseCover src={course.coverImageUrl} alt={course.courseName} className="sm:w-60 sm:shrink-0 sm:self-stretch" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="min-w-0 flex-1 font-semibold text-ink">{course.courseName}</h2>
          <StatusBadge type="RegistrationStatus" value={status} />
        </div>
        <p className="text-sm text-muted">
          {formatVND(price)} · Đăng ký {formatDate(registration.registeredAt)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
          {status === "DA_THANH_TOAN" && (
            <Link to={generatePath(ROUTES.LEARN, { courseId: course.id })} className={primaryClass}>
              Vào học
            </Link>
          )}
          {status === "CHO_THANH_TOAN" && (
            <Link to={paymentPath} className={primaryClass}>
              Thanh toán tiếp
            </Link>
          )}
          {status !== "CHO_THANH_TOAN" && (
            <Link to={paymentPath} className={status === "DA_THANH_TOAN" ? linkClass : secondaryClass}>
              Hóa đơn
            </Link>
          )}
          <Link to={generatePath(ROUTES.COURSE_DETAIL, { id: course.id })} className={linkClass}>
            Xem khóa học
          </Link>
        </div>
      </div>
    </article>
  );
}
