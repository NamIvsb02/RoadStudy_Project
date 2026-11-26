import { Star } from "lucide-react";
import { generatePath, Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { formatVND } from "../../utils/format";
import Avatar from "../ui/Avatar";
import CourseCover from "./CourseCover";

export default function CourseCard({ course }) {
  const { id, courseName, price, coverImageUrl, category, teacher, averageRating, reviewCount } = course;

  return (
    <Link
      to={generatePath(ROUTES.COURSE_DETAIL, { id })}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-[transform,box-shadow,border-color] duration-200 ease-out-soft hover:-translate-y-1 hover:border-line-strong hover:shadow-card-hover focus-visible:-translate-y-1 focus-visible:shadow-card-hover"
    >
      <div className="relative">
        <CourseCover src={coverImageUrl} alt={courseName} />
        {category && <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-accent-strong">{category.categoryName}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 min-h-12 font-semibold text-ink-strong">{courseName}</h3>
        {teacher && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Avatar src={teacher.account.avatarUrl} name={teacher.account.fullName} size="sm" />
            <span className="truncate">{teacher.account.fullName}</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
          <span className="text-lg font-bold text-primary">{formatVND(price)}</span>
          {reviewCount > 0 && (
            <span className="flex items-center gap-1 text-sm text-ink">
              <Star size={16} className="text-accent" fill="currentColor" />
              {averageRating}
              <span className="text-muted">({reviewCount})</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
