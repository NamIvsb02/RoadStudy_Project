import { useCallback } from "react";
import { Link, generatePath, useParams } from "react-router-dom";
import { BookOpenCheck, FolderOpen, Video } from "lucide-react";
import BackButton from "../../components/common/BackButton";
import ErrorState from "../../components/common/ErrorState";
import PageSkeleton from "../../components/common/PageSkeleton";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import { learningApi } from "../../api/learningApi";
import { formatDate } from "../../utils/format";
import LearnExams from "./LearnExams";
import SessionList from "./SessionList";
import CommentSection from "../courseDetail/CommentSection";

const actionBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light";

export default function LearnPage() {
  const { courseId } = useParams();
  const request = useCallback(() => learningApi.get(courseId), [courseId]);
  const { data, loading, error, reload } = useFetch(request);

  if (loading) return <PageSkeleton />;
  if (error) {
    return (
      <div className="flex flex-col items-center gap-2">
        <ErrorState message={error} onRetry={reload} />
        <Link to={generatePath(ROUTES.COURSE_DETAIL, { id: courseId })} className="inline-flex h-11 items-center text-sm font-semibold text-primary hover:underline">
          Xem trang khóa học
        </Link>
      </div>
    );
  }

  const { course } = data;

  return (
    <div className="flex flex-col gap-5">
      <BackButton fallback={ROUTES.MY_COURSES}>Quay lại khóa học của tôi</BackButton>
      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
          <BookOpenCheck size={16} aria-hidden="true" />
          Không gian học
        </p>
        <h1 className="mt-2 text-2xl font-bold text-ink">{course.courseName}</h1>
        <p className="mt-1 text-sm text-muted">
          {course.teacher?.account?.fullName} · {formatDate(course.startDate)} - {formatDate(course.endDate)}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {data.classUrl ? (
            <a href={data.classUrl} target="_blank" rel="noopener noreferrer" className={`${actionBase} bg-primary text-white hover:bg-primary-dark`}>
              <Video size={20} aria-hidden="true" />
              Vào học
            </a>
          ) : (
            <span className={`${actionBase} cursor-not-allowed bg-surface text-muted`}>
              <Video size={20} aria-hidden="true" />
              Vào học
            </span>
          )}
          {data.driveUrl && (
            <a href={data.driveUrl} target="_blank" rel="noopener noreferrer" className={`${actionBase} border border-primary text-primary hover:bg-primary/10`}>
              <FolderOpen size={20} aria-hidden="true" />
              Thư mục tài liệu
            </a>
          )}
        </div>
        {(!data.classUrl || !data.driveUrl) && (
          <p className="mt-3 text-xs text-muted">
            {[!data.classUrl && "Giáo viên chưa cập nhật link vào học.", !data.driveUrl && "Giáo viên chưa cập nhật tài liệu."].filter(Boolean).join(" ")}
          </p>
        )}
      </section>
      <section className="rounded-xl border border-line bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-ink">Lịch học online</h2>
        <SessionList sessions={data.sessions} />
      </section>
      {data.showExams && <LearnExams courseId={course.id} />}
      <CommentSection courseId={course.id} />
    </div>
  );
}
