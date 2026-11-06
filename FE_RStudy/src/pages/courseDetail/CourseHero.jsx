import { generatePath, Link } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import StarRating from '../../components/common/StarRating';
import { ROUTES } from '../../constants/routes';
import { assetUrl } from '../../utils/format';

export default function CourseHero({ course }) {
  const { courseName, coverImageUrl, category, teacher, averageRating, reviewCount } = course;

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="aspect-video bg-soft">
        {coverImageUrl && (
          <img src={assetUrl(coverImageUrl)} alt={courseName} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="space-y-3 p-5">
        <Link
          to={`${ROUTES.COURSES}?categoryId=${category.id}`}
          className="inline-block rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-white"
        >
          {category.categoryName}
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">{courseName}</h1>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <StarRating value={averageRating ?? 0} />
          <span>
            {averageRating ?? 'Chưa có'} ({reviewCount} đánh giá)
          </span>
        </div>
        <Link
          to={generatePath(ROUTES.TEACHER_PROFILE, { id: teacher.id })}
          className="flex items-center gap-3"
        >
          <Avatar src={teacher.account.avatarUrl} name={teacher.account.fullName} />
          <span>
            <span className="block font-medium text-slate-800">{teacher.account.fullName}</span>
            <span className="block text-sm text-slate-500">{teacher.specialization}</span>
          </span>
        </Link>
      </div>
    </div>
  );
}