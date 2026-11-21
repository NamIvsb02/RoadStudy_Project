import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { formatVND } from "../../utils/format";

export default function ChatCourseCard({ recommendation }) {
  const { course, recommendationReason } = recommendation;
  const free = Number(course.price) === 0;
  const meta = [course.category?.categoryName, free ? "Miễn phí" : formatVND(course.price)].filter(Boolean).join(" · ");

  return (
    <div className="mt-2 rounded-lg border border-line bg-white p-2.5 text-ink">
      <p className="text-sm font-semibold">{course.courseName}</p>
      <p className="text-xs text-muted">{meta}</p>
      {recommendationReason && <p className="mt-1 text-xs text-muted">{recommendationReason}</p>}
      <Link to={generatePath(ROUTES.COURSE_DETAIL, { id: course.id })} className="mt-1.5 inline-block text-xs font-semibold text-primary hover:underline">
        Xem khóa học
      </Link>
    </div>
  );
}
