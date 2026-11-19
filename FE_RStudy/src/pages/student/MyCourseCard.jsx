import { useState } from "react";
import { Link, generatePath } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge";
import { ROUTES } from "../../constants/routes";
import { assetUrl, formatDate, formatVND } from "../../utils/format";

export default function MyCourseCard({ registration }) {
  const { course, status } = registration;
  const [imageFailed, setImageFailed] = useState(false);
  const cover = assetUrl(course.coverImageUrl);
  const price = status === "DA_THANH_TOAN" ? registration.amountPaid : course.price;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
      {cover && !imageFailed ? (
        <img src={cover} alt={course.courseName} onError={() => setImageFailed(true)} className="aspect-video w-full object-cover" />
      ) : (
        <div className="aspect-video w-full bg-primary/10" />
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-ink">{course.courseName}</h2>
          <StatusBadge type="RegistrationStatus" value={status} />
        </div>
        <p className="text-sm text-muted">
          {formatVND(price)} · Đăng ký {formatDate(registration.registeredAt)}
        </p>
        <div className="mt-auto flex flex-wrap gap-3 pt-2 text-sm font-semibold">
          <Link to={generatePath(ROUTES.COURSE_DETAIL, { id: course.id })} className="text-primary hover:underline">
            Xem khóa học
          </Link>
          <Link to={generatePath(ROUTES.PAYMENT, { id: registration.id })} className="text-primary hover:underline">
            {status === "CHO_THANH_TOAN" ? "Thanh toán" : "Hóa đơn"}
          </Link>
          {status === "DA_THANH_TOAN" && (
            <Link to={ROUTES.EXAMS} className="text-primary hover:underline">
              Đề thi
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
