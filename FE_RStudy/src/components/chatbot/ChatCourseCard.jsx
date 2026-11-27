import { Link, generatePath } from "react-router-dom";
import CourseCover from "../common/CourseCover";
import { ROUTES } from "../../constants/routes";
import { formatVND } from "../../utils/format";

export default function ChatCourseCard({ recommendation }) {
  const { course, recommendationReason } = recommendation;
  const free = Number(course.price) === 0;
  const meta = [course.category?.categoryName, free ? "Miễn phí" : formatVND(course.price)].filter(Boolean).join(" · ");

  return (
    <div className="mt-2 flex gap-2.5 rounded-lg border border-line bg-white p-2.5 text-ink">
      <div className="w-20 shrink-0">
        <CourseCover src={course.coverImageUrl} className="rounded-md" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-strong">{course.courseName}</p>
        <p className="text-xs text-muted">{meta}</p>
        {recommendationReason && <p className="mt-1 text-xs text-muted">{recommendationReason}</p>}
        <Link
          to={generatePath(ROUTES.COURSE_DETAIL, { id: course.id })}
          className="mt-1 inline-flex min-h-11 items-center text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Xem khóa học
        </Link>
      </div>
    </div>
  );
}
