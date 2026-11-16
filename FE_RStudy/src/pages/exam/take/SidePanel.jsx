import Button from "../../../components/ui/Button";

const pad = (value) => String(value).padStart(2, "0");

export default function SidePanel({ className = "", remaining, questions, answers, submitting, onJump, onSubmit }) {
  const total = questions.length;
  const answered = questions.filter((question) => answers[question.id]).length;
  const left = total - answered;
  const firstMissing = questions.findIndex((question) => !answers[question.id]);

  return (
    <aside className={`sticky top-2 rounded-xl border border-line bg-white p-5 lg:top-4 ${className}`}>
      <p className="text-sm text-muted">Thời gian còn lại</p>
      <p role="timer" className={`my-1 text-4xl font-bold ${remaining <= 60 ? "text-danger" : "text-primary"}`}>
        {pad(Math.floor(remaining / 60))}:{pad(remaining % 60)}
      </p>
      <div className="flex justify-between text-sm">
        <span>Đã làm</span>
        <b>
          {answered}/{total}
        </b>
      </div>
      <div className="mt-1.5 mb-4 h-2 rounded-full bg-primary/10">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${total ? (answered / total) * 100 : 0}%` }} />
      </div>
      <div className="hidden max-h-64 grid-cols-5 justify-items-center gap-2 overflow-y-auto lg:grid">
        {questions.map((question, index) => (
          <button
            key={question.id}
            type="button"
            onClick={() => onJump(question.id)}
            aria-label={`Đến câu ${index + 1}`}
            className={`size-9 rounded-full border-2 text-sm transition-colors ${answers[question.id] ? "border-primary bg-primary text-white" : "border-primary/40 bg-white text-primary hover:bg-primary/10"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <Button className="mt-5 w-full" disabled={left > 0} loading={submitting} onClick={onSubmit}>
        Nộp bài
      </Button>
      {left > 0 && (
        <p className="mt-3 text-sm text-warning">
          Còn {left} câu chưa chọn đáp án. Chọn hết mới nộp được.{" "}
          <button type="button" onClick={() => onJump(questions[firstMissing].id)} className="font-semibold text-primary hover:underline">
            Đến câu {firstMissing + 1}
          </button>
        </p>
      )}
    </aside>
  );
}
