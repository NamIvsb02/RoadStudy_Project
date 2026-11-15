import { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { submissionApi } from "../../../api/submissionApi";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import FormAlert from "../../../components/ui/FormAlert";
import { ROUTES } from "../../../constants/routes";
import { useCountdown } from "../../../hooks/useCountdown";
import QuestionCard from "./QuestionCard";
import ResultDialog from "./ResultDialog";
import SidePanel from "./SidePanel";

const toList = (answers) => Object.entries(answers).map(([questionId, answerOptionId]) => ({ questionId, answerOptionId }));

export default function ExamRoom({ session, onRetry }) {
  const { attempt, exam, questions } = session;
  const navigate = useNavigate();
  const [endAt] = useState(() => Date.now() + attempt.remainingSeconds * 1000);
  const [answers, setAnswers] = useState(() => Object.fromEntries(session.answers.filter((item) => item.answerOptionId).map((item) => [item.questionId, item.answerOptionId])));
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [focusId, setFocusId] = useState(null);

  const recover = async (message) => {
    const res = await submissionApi.getById(attempt.id).catch(() => null);
    if (res && res.data.status !== "DANG_LAM") setResult(res.data);
    else setError(message);
  };

  const submit = async () => {
    setConfirming(false);
    setSubmitting(true);
    setError("");
    const list = toList(answers);
    try {
      const res = await submissionApi.submit(attempt.id, list.length ? { answers: list } : undefined);
      setResult(res.data);
    } catch (err) {
      await recover(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remaining = useCountdown(endAt, submit, !result && !submitting);
  const answeredCount = questions.filter((question) => answers[question.id]).length;

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setFocusId(null);
    submissionApi.saveAnswers(attempt.id, [{ questionId, answerOptionId: optionId }]).catch((err) => setError(err.message));
  };

  const handleJump = (questionId) => {
    setFocusId(answers[questionId] ? null : questionId);
    document.getElementById(`q-${questionId}`)?.scrollIntoView({ block: "center" });
  };

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-ink">{exam.examName}</h1>
        <FormAlert message={error} />
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            index={index}
            question={question}
            selectedId={answers[question.id]}
            highlighted={focusId === question.id}
            disabled={Boolean(result) || submitting}
            onSelect={handleSelect}
          />
        ))}
      </div>
      <SidePanel className="order-first lg:order-last" remaining={remaining} questions={questions} answers={answers} submitting={submitting} onJump={handleJump} onSubmit={() => setConfirming(true)} />
      <ConfirmDialog
        open={confirming}
        title="Nộp bài?"
        message={`Bạn đã chọn đủ ${answeredCount}/${questions.length} câu. Sau khi nộp không thể sửa.`}
        confirmLabel="Nộp bài"
        onConfirm={submit}
        onCancel={() => setConfirming(false)}
      />
      {result && (
        <ResultDialog
          result={result}
          onRetry={onRetry}
          onReview={() => navigate(generatePath(ROUTES.ATTEMPT_DETAIL, { id: result.id }))}
          onBack={() => navigate(generatePath(ROUTES.EXAM_DETAIL, { id: exam.id }))}
        />
      )}{" "}
    </div>
  );
}
