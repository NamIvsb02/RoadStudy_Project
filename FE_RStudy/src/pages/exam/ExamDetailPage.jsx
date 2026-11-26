import { useCallback } from "react";
import { Link, generatePath, useParams } from "react-router-dom";
import { examApi } from "../../api/examApi";
import { submissionApi } from "../../api/submissionApi";
import Button from "../../components/ui/Button";
import ErrorState from "../../components/common/ErrorState";
import PageSkeleton from "../../components/common/PageSkeleton";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import AttemptHistory from "./detail/AttemptHistory";
import { formatScore } from "./examFormat";

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-primary-50 p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}

export default function ExamDetailPage() {
  const { id } = useParams();
  const fetchExam = useCallback(() => examApi.getById(id), [id]);
  const fetchHistory = useCallback(() => submissionApi.getMine({ examId: id, limit: 20 }), [id]);
  const exam = useFetch(fetchExam);
  const history = useFetch(fetchHistory);

  if (exam.loading) return <PageSkeleton />;
  if (exam.error) return <ErrorState message={exam.error} onRetry={exam.reload} />;

  const { data } = exam;
  const items = history.data?.items ?? [];
  const inProgress = items.some((attempt) => attempt.status === "DANG_LAM");
  const exhausted = data.attemptsUsed >= data.maxAttempts && !inProgress;

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-line bg-white p-6">
        <h1 className="text-2xl font-bold text-ink">{data.examName}</h1>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoItem label="Số câu" value={data.questionCount} />
          <InfoItem label="Thời gian làm bài" value={`${data.durationMinutes} phút`} />
          <InfoItem label="Điểm đạt" value={`${formatScore(data.passingScore)} điểm`} />
          <InfoItem label="Đã làm" value={`${data.attemptsUsed}/${data.maxAttempts} lượt`} />
        </div>
        <div className="mt-5">
          {exhausted ? (
            <Button disabled>Đã hết lượt</Button>
          ) : (
            <Link
              to={generatePath(ROUTES.EXAM_TAKE, { id })}
              className="inline-flex h-12 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
            >
              {inProgress ? "Làm tiếp" : "Vào phòng thi"}
            </Link>
          )}
        </div>
      </section>
      <AttemptHistory items={items} loading={history.loading} error={history.error} />
    </div>
  );
}
