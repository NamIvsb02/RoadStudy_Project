import { useCallback } from "react";
import { Link, generatePath } from "react-router-dom";
import { examApi } from "../../../api/examApi";
import DashboardPanel from "../../../components/common/DashboardPanel";
import { ROUTES } from "../../../constants/routes";
import { useFetch } from "../../../hooks/useFetch";
import { formatScore } from "../examFormat";

export default function CourseExams({ course }) {
  const request = useCallback(() => examApi.listByCourse(course.id, { limit: 50 }), [course.id]);
  const { data, loading, error } = useFetch(request);
  const items = data?.items ?? [];

  return (
    <DashboardPanel title={course.courseName} loading={loading} error={error} empty={items.length === 0} emptyText="Khóa học này chưa có đề thi nào đang mở.">
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((exam) => (
          <li key={exam.id}>
            <Link to={generatePath(ROUTES.EXAM_DETAIL, { id: exam.id })} className="block rounded-xl border border-line p-4 transition-colors hover:bg-soft">
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
    </DashboardPanel>
  );
}
