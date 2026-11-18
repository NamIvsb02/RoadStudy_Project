import { useCallback } from "react";
import { generatePath, useParams } from "react-router-dom";
import { submissionApi } from "../../api/submissionApi";
import BackButton from "../../components/common/BackButton";
import ResultBadge from "../../components/common/ResultBadge";
import FormAlert from "../../components/ui/FormAlert";
import LoadingState from "../../components/ui/LoadingState";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import { formatDateTime } from "../../utils/format";
import { formatScore } from "../exam/examFormat";
import TeacherQuestionReview from "./exam/TeacherQuestionReview";

export default function TeacherAttemptPage() {
  const { id } = useParams();
  const request = useCallback(() => submissionApi.getById(id), [id]);
  const { data, loading, error } = useFetch(request);
  const fallback = data ? generatePath(ROUTES.TEACHER.EXAM_SUBMISSIONS, { id: data.examId }) : ROUTES.TEACHER.EXAMS;
  const back = <BackButton fallback={fallback}>Quay lại danh sách bài làm</BackButton>;

  if (loading) return <LoadingState />;
  if (error) {
    return (
      <div className="flex flex-col gap-4">
        {back}
        <FormAlert message={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {back}
      <section className="rounded-xl border border-line bg-white p-6">
        <h1 className="text-xl font-bold text-primary">{data.examName}</h1>
        <p className="mt-1 text-sm text-muted">Làm lúc {formatDateTime(data.startTime)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-3xl font-bold text-primary">
            {formatScore(data.score)}
            <span className="text-lg text-muted">/{formatScore(data.totalScore)}</span>
          </p>
          <ResultBadge passed={data.passed} status={data.status} />
          <span className="text-sm text-muted">Điểm đạt: {formatScore(data.passingScore)}</span>
        </div>
      </section>
      {(data.questions ?? []).map((question, index) => (
        <TeacherQuestionReview key={question.questionId} index={index} question={question} />
      ))}
    </div>
  );
}
