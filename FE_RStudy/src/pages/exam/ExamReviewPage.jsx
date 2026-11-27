import { useCallback } from "react";
import { Link, generatePath, useParams } from "react-router-dom";
import { submissionApi } from "../../api/submissionApi";
import ResultBadge from "../../components/common/ResultBadge";
import ErrorState from "../../components/common/ErrorState";
import PageSkeleton from "../../components/common/PageSkeleton";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import { formatDateTime } from "../../utils/format";
import { durationBetween, formatDuration, formatScore } from "./examFormat";
import QuestionReview from "./review/QuestionReview";

export default function ExamReviewPage() {
  const { id } = useParams();
  const request = useCallback(() => submissionApi.getById(id), [id]);
  const { data, loading, error, reload } = useFetch(request);

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const backTo = generatePath(ROUTES.EXAM_DETAIL, { id: data.examId });
  const seconds = durationBetween(data.startTime, data.endTime);

  return (
    <div className="flex flex-col gap-4">
      <Link to={backTo} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">
        ← Quay lại đề thi
      </Link>
      <section className="rounded-xl border border-line bg-white p-6">
        <h1 className="text-2xl font-bold text-ink">{data.examName}</h1>
        <p className="mt-1 text-sm text-muted">
          Làm lúc {formatDateTime(data.startTime)}
          {seconds !== null && ` · ${formatDuration(seconds)}`}
        </p>
        {data.status === "DANG_LAM" ? (
          <p className="mt-3 text-sm text-ink">
            Bài làm này chưa nộp.{" "}
            <Link to={generatePath(ROUTES.EXAM_TAKE, { id: data.examId })} className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">
              Làm tiếp
            </Link>
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-bold text-primary">
              {formatScore(data.score)}
              <span className="text-lg text-muted">/{formatScore(data.totalScore)}</span>
            </p>
            <ResultBadge passed={data.passed} status={data.status} />
            <span className="text-sm text-muted">Điểm đạt: {formatScore(data.passingScore)}</span>
          </div>
        )}
      </section>
      {(data.questions ?? []).map((question, index) => (
        <QuestionReview key={question.questionId} index={index} question={question} />
      ))}
    </div>
  );
}
