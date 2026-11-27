import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { examApi } from "../../../api/examApi";
import Button from "../../../components/ui/Button";
import FormAlert from "../../../components/ui/FormAlert";
import ListSkeleton from "../../../components/common/ListSkeleton";
import { fadeIn, scaleIn } from "../../../constants/motion";
import { useFetch } from "../../../hooks/useFetch";
import { formatScore } from "../../exam/examFormat";

function PreviewBody({ examId }) {
  const request = useCallback(() => examApi.getById(examId), [examId]);
  const { data, loading, error } = useFetch(request);

  if (loading) return <ListSkeleton />;
  if (error) return <FormAlert message={error} />;

  return (
    <div>
      <p className="text-sm text-muted">
        {data.questions.length} câu · tổng {formatScore(data.totalScore)} điểm · đạt từ {formatScore(data.passingScore)} điểm
      </p>
      <ol className="mt-4 flex flex-col gap-4">
        {data.questions.map((question, index) => (
          <li key={question.id}>
            <p className="font-semibold text-ink">
              Câu {index + 1} ({formatScore(question.score)} điểm)
            </p>
            <p className="mt-1 whitespace-pre-line text-sm text-ink">{question.content}</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {question.options.map((option, optionIndex) => (
                <li key={option.id} className={`flex gap-2 rounded-lg border px-3 py-2 text-sm ${option.isCorrect ? "border-success bg-success/10" : "border-line"}`}>
                  <span className="font-semibold text-primary">{String.fromCharCode(65 + optionIndex)}.</span>
                  <span className="whitespace-pre-line">{option.content}</span>
                  {option.isCorrect && <span className="ml-auto shrink-0 text-xs text-success-strong">Đáp án đúng</span>}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ExamPreviewDialog({ exam, onClose }) {
  return (
    <AnimatePresence>
      {exam && (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" onMouseDown={onClose} className="fixed inset-0 z-50 flex overflow-y-auto bg-black/40 p-4">
          <motion.div
            variants={scaleIn}
            role="dialog"
            aria-modal="true"
            aria-label={exam.examName}
            onMouseDown={(event) => event.stopPropagation()}
            className="m-auto flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-card-hover"
          >
            <h2 className="mb-3 text-lg font-semibold text-ink">{exam.examName}</h2>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <PreviewBody key={exam.id} examId={exam.id} />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
