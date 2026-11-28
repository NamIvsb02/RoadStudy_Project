import { useCallback, useEffect, useRef } from "react";
import { Link, generatePath } from "react-router-dom";
import { examApi } from "../../api/examApi";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import ListSkeleton from "../../components/common/ListSkeleton";
import { PERMISSIONS } from "../../constants/permissions";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { hasPermission } from "../../utils/permission";
import { formatScore } from "../exam/examFormat";

const cardClass = "block w-64 shrink-0 snap-start rounded-xl border border-line p-4";
const linkCardClass = `${cardClass} transition-[background-color,border-color,box-shadow] duration-200 hover:border-primary-200 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light`;

// Trang làm bài chỉ dành cho học viên (vai trò khác bị ProtectedRoute đẩy về trang chủ của vai trò),
// nên giáo viên xem bài làm của đề, admin có quyền vào trang quản lý đề thi, admin thiếu quyền chỉ xem thẻ.
const examLinkFor = (account, examId) => {
  if (account?.role === ROLES.TEACHER) return generatePath(ROUTES.TEACHER.EXAM_SUBMISSIONS, { id: examId });
  if (account?.role === ROLES.ADMINISTRATOR) return hasPermission(account, PERMISSIONS.QUAN_LY_BAI_THI) ? ROUTES.ADMIN.EXAMS : null;
  return generatePath(ROUTES.EXAM_DETAIL, { id: examId });
};

export default function LearnExams({ courseId }) {
  const { account } = useAuth();
  const isStudent = account?.role === ROLES.STUDENT;
  const request = useCallback(() => examApi.listByCourse(courseId, { limit: 50 }), [courseId]);
  const { data, loading, error, reload } = useFetch(request);
  const trackRef = useRef(null);
  const items = data?.items ?? [];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const handleWheel = (event) => {
      if (track.scrollWidth <= track.clientWidth || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const atStart = track.scrollLeft <= 0 && event.deltaY < 0;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1 && event.deltaY > 0;
      if (atStart || atEnd) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    };
    track.addEventListener("wheel", handleWheel, { passive: false });
    return () => track.removeEventListener("wheel", handleWheel);
  }, [items.length]);

  let body;
  if (loading) body = <ListSkeleton rows={2} />;
  else if (error) body = <ErrorState message={error} onRetry={reload} />;
  else if (items.length === 0) body = <EmptyState title="Chưa có đề thi" description="Khóa học này chưa có đề thi nào đang mở." />;
  else {
    body = (
      <div ref={trackRef} className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-3 [scrollbar-width:thin]">
        {items.map((exam) => {
          const to = examLinkFor(account, exam.id);
          const content = (
            <>
              <p className="font-semibold text-ink">{exam.examName}</p>
              <p className="mt-1 text-sm text-muted">
                {exam.questionCount} câu · {exam.durationMinutes} phút · đạt từ {formatScore(exam.passingScore)} điểm
              </p>
              {isStudent && (
                <p className="mt-2 text-xs font-medium text-primary">
                  Đã làm {exam.attemptsUsed}/{exam.maxAttempts} lượt
                </p>
              )}
            </>
          );
          return to ? (
            <Link key={exam.id} to={to} className={linkCardClass}>
              {content}
            </Link>
          ) : (
            <div key={exam.id} className={cardClass}>
              {content}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-ink">Bài thi</h2>
      {body}
    </section>
  );
}
