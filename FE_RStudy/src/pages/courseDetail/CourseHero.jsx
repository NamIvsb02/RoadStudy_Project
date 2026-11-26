import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { generatePath, Link } from "react-router-dom";
import Avatar from "../../components/ui/Avatar";
import StarRating from "../../components/common/StarRating";
import CourseCover from "../../components/common/CourseCover";
import { imageReveal } from "../../constants/motion";
import { ROUTES } from "../../constants/routes";
import { formatDate } from "../../utils/format";

export default function CourseHero({ course }) {
  const { courseName, coverImageUrl, category, teacher, averageRating, reviewCount, startDate, endDate } = course;

  return (
    <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
      <motion.div
        variants={imageReveal}
        initial="hidden"
        animate="visible"
        className="overflow-hidden rounded-2xl border border-line shadow-raised"
      >
        <CourseCover src={coverImageUrl} alt={courseName} />
      </motion.div>
      <div className="space-y-4">
        <Link
          to={`${ROUTES.COURSES}?categoryId=${category.id}`}
          className="inline-flex min-h-8 items-center rounded-full bg-accent-soft px-3 text-xs font-semibold text-accent-strong"
        >
          {category.categoryName}
        </Link>
        <h1 className="text-headline font-bold text-ink-strong">{courseName}</h1>
        <div className="flex items-center gap-2 text-sm text-muted">
          <StarRating value={averageRating ?? 0} />
          <span>
            {averageRating ?? "Chưa có"} ({reviewCount} đánh giá)
          </span>
        </div>
        <Link to={generatePath(ROUTES.TEACHER_PROFILE, { id: teacher.id })} className="flex min-h-11 items-center gap-3">
          <Avatar src={teacher.account.avatarUrl} name={teacher.account.fullName} />
          <span>
            <span className="block font-medium text-ink-strong">{teacher.account.fullName}</span>
            <span className="block text-sm text-muted">{teacher.specialization}</span>
          </span>
        </Link>
        <p className="flex items-center gap-2 text-sm text-muted">
          <CalendarDays size={16} />
          {formatDate(startDate)} - {formatDate(endDate)}
        </p>
      </div>
    </div>
  );
}
