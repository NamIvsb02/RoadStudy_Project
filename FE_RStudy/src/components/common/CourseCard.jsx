import { Star } from 'lucide-react';
import { generatePath, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { assetUrl, formatVND } from '../../utils/format';
import Avatar from '../ui/Avatar';

export default function CourseCard({ course }) {
  const { id, courseName, price, coverImageUrl, category, teacher, averageRating, reviewCount } =
    course;

  return (
    <Link
      to={generatePath(ROUTES.COURSE_DETAIL, { id })}
      className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-video bg-soft">
        {coverImageUrl && (
          <img src={assetUrl(coverImageUrl)} alt={courseName} className="h-full w-full object-cover" />
        )}
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-white">
            {category.categoryName}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-semibold text-slate-800">{courseName}</h3>
        {teacher && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Avatar src={teacher.account.avatarUrl} name={teacher.account.fullName} size="sm" />
            <span className="truncate">{teacher.account.fullName}</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-primary">{formatVND(price)}</span>
          {reviewCount > 0 && (
            <span className="flex items-center gap-1 text-sm text-slate-600">
              <Star size={16} className="text-accent" fill="currentColor" />
              {averageRating}
              <span className="text-slate-400">({reviewCount})</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}