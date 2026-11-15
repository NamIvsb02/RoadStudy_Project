import { useCallback } from "react";
import { Check, TriangleAlert } from "lucide-react";
import { examApi } from "../../../api/examApi";
import Button from "../../../components/ui/Button";
import { useFetch } from "../../../hooks/useFetch";
import { durationBetween, formatDuration, formatScore } from "../examFormat";

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2 text-sm">
      <span className="text-muted">{label}</span>
      <b className="text-right text-ink">{children}</b>
    </div>
  );
}

export default function ResultDialog({ result, onBack, onRetry, onReview }) {
  const fetchExam = useCallback(() => examApi.getById(result.examId), [result.examId]);
  const { data: exam } = useFetch(fetchExam);
  const passed = result.passed === true;
  const graded = result.passed !== null && result.passed !== undefined;
  const seconds = durationBetween(result.startTime, result.endTime);
  const canRetry = Boolean(exam) && exam.attemptsUsed < exam.maxAttempts;
  const Icon = passed ? Check : TriangleAlert;

  let title = "Bạn đã nộp bài";
  if (graded) title = passed ? "Chúc mừng, bạn đã đạt!" : "Chưa đạt, hãy thử lại";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-card-hover">
        <span className={`mx-auto flex size-16 items-center justify-center rounded-full text-white ${passed ? "bg-success" : "bg-accent"}`}>
          <Icon size={24} />
        </span>
        <h2 className="mt-3 text-xl font-bold text-primary">{title}</h2>
        <p className={`my-2 text-4xl font-bold ${passed ? "text-success" : "text-danger"}`}>
          {formatScore(result.score)}
          <span className="text-xl text-muted">/{formatScore(result.totalScore)}</span>
        </p>
        <div className="mb-5 text-left">
          <Row label="Điểm đạt">{formatScore(result.passingScore)}</Row>
          {seconds !== null && (
            <Row label="Thời gian làm bài">
              {formatDuration(seconds)}
              {result.autoSubmitted && " (hết giờ, tự nộp)"}
            </Row>
          )}
          {exam && (
            <Row label="Lượt làm">
              {exam.attemptsUsed}/{exam.maxAttempts}
            </Row>
          )}
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={onReview}>
            Xem chi tiết
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Quay lại
          </Button>
          {canRetry && <Button onClick={onRetry}>Làm lại</Button>}
        </div>
      </div>
    </div>
  );
}
