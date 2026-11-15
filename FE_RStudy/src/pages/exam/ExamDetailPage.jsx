import { useCallback } from "react";
import { Link, generatePath, useParams } from "react-router-dom";
import { examApi } from "../../api/examApi";
import { submissionApi } from "../../api/submissionApi";
import Button from "../../components/ui/Button";
import LoadingState from "../../components/ui/LoadingState";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import AttemptHistory from "./detail/AttemptHistory";
import { formatScore } from "./examFormat";

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <p className="text-xl font-bold text-ink">{value}</p>
    </div>
  );
}

export default function ExamDetailPage() {
  const { id } = useParams();
  const fetchExam = useCallback(() => examApi.getById(id), [id]);
  const fetchHistory = useCallback(() => submissionApi.getMine({ examId: id, limit: 20 }), [id]);
  const exam = useFetch(fetchExam);
  const history = useFetch(fetchHistory);

  if (exam.loading) return <LoadingState />;
  if (exam.error) {
    return (
      <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
        {exam.error}
      </p>
    );
  }

  const { data } = exam;
  const items = history.data?.items ?? [];
  const inProgress = items.some((attempt) => attempt.status === "DANG_LAM");
  const exhausted = data.attemptsUsed >= data.maxAttempts && !inProgress;

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-line bg-white p-6">
        <h1 className="text-2xl font-bold text-primary">{data.examName}</h1>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
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
              className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
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
