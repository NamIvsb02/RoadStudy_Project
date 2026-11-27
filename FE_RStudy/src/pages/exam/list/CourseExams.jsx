import { useCallback } from "react";
import { Link, generatePath } from "react-router-dom";
import { examApi } from "../../../api/examApi";
import EmptyState from "../../../components/common/EmptyState";
import ErrorState from "../../../components/common/ErrorState";
import ListSkeleton from "../../../components/common/ListSkeleton";
import { ROUTES } from "../../../constants/routes";
import { useFetch } from "../../../hooks/useFetch";
import { formatScore } from "../examFormat";

export default function CourseExams({ course }) {
  const request = useCallback(() => examApi.listByCourse(course.id, { limit: 50 }), [course.id]);
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];

  let body;
  if (loading) body = <ListSkeleton rows={2} />;
  else if (error) body = <ErrorState message={error} onRetry={reload} />;
  else if (items.length === 0) body = <EmptyState title="Chưa có đề thi" description="Khóa học này chưa có đề thi nào đang mở." />;
  else {
    body = (
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((exam) => (
          <li key={exam.id}>
            <Link
              to={generatePath(ROUTES.EXAM_DETAIL, { id: exam.id })}
              className="block h-full rounded-xl border border-line p-4 transition-[background-color,border-color] duration-200 hover:border-primary-200 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
            >
              <p className="font-semibold text-ink">{exam.examName}</p>
              <p className="mt-1 text-sm text-muted">
                {exam.questionCount} câu · {exam.durationMinutes} phút · đạt từ {formatScore(exam.passingScore)} điểm
              </p>
              <p className="mt-2 text-xs font-medium text-primary">
                Đã làm {exam.attemptsUsed}/{exam.maxAttempts} lượt
              </p>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-ink">{course.courseName}</h2>
      {body}
    </section>
  );
}
