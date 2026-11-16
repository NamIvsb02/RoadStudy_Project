export default function ShowAnswersSwitch({ exam, busy, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={exam.showAnswers}
      aria-label={`Cho học viên xem đáp án đề ${exam.examName}`}
      disabled={busy}
      onClick={() => onToggle(exam)}
      className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${exam.showAnswers ? "bg-primary" : "bg-line"}`}
    >
      <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform ${exam.showAnswers ? "translate-x-5" : ""}`} />
    </button>
  );
}
