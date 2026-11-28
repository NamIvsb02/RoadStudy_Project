import { Star } from "lucide-react";
import { generatePath, Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { formatVND } from "../../utils/format";
import Avatar from "../ui/Avatar";
import CourseCover from "./CourseCover";

export default function CourseCard({ course }) {
  const { id, courseName, price, coverImageUrl, category, teacher, averageRating, reviewCount } = course;

  return (
    // Link đứng yên làm vùng nhận hover; chỉ lớp bên trong nâng lên, tránh giật khi chuột ở mép dưới thẻ.
    // Bóng nằm ở after: và chỉ đổi opacity để không phải vẽ lại box-shadow mỗi khung hình.
    <Link to={generatePath(ROUTES.COURSE_DETAIL, { id })} className="group block h-full rounded-xl">
      <div className="relative h-full rounded-xl transition-transform duration-200 ease-out-soft after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:shadow-card-hover after:transition-opacity after:duration-200 after:ease-out-soft group-hover:after:opacity-100 group-focus-visible:after:opacity-100 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-y-1">
      <div className="isolate flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-colors duration-200 ease-out-soft group-hover:border-line-strong">
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
      </div>
      </div>
    </Link>
  );
}
