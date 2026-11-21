import { Link, generatePath } from "react-router-dom";
import CourseCover from "../../components/common/CourseCover";
import StatusBadge from "../../components/ui/StatusBadge";
import { ROUTES } from "../../constants/routes";
import { formatDate, formatVND } from "../../utils/format";

const linkClass = "text-primary hover:underline";

export default function MyCourseCard({ registration }) {
  const { course, status } = registration;
  const price = status === "DA_THANH_TOAN" ? registration.amountPaid : course.price;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
      <CourseCover src={course.coverImageUrl} alt={course.courseName} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-ink">{course.courseName}</h2>
          <StatusBadge type="RegistrationStatus" value={status} />
        </div>
        <p className="text-sm text-muted">
          {formatVND(price)} · Đăng ký {formatDate(registration.registeredAt)}
        </p>
        <div className="mt-auto flex flex-wrap gap-3 pt-2 text-sm font-semibold">
          {status === "DA_THANH_TOAN" && (
            <Link to={generatePath(ROUTES.LEARN, { courseId: course.id })} className={linkClass}>
              Vào học
            </Link>
          )}
          <Link to={generatePath(ROUTES.COURSE_DETAIL, { id: course.id })} className={linkClass}>
            Xem khóa học
          </Link>
          <Link to={generatePath(ROUTES.PAYMENT, { id: registration.id })} className={linkClass}>
            {status === "CHO_THANH_TOAN" ? "Thanh toán" : "Hóa đơn"}
          </Link>
        </div>
      </div>
    </article>
  );
}
