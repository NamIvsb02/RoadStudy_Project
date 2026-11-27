export default function QuestionReview({ index, question }) {
  const answered = Boolean(question.selectedAnswerOptionId);
  const revealed = question.isCorrect !== undefined;

  let badge = null;
  if (revealed) {
    const tone = question.isCorrect ? "bg-success/10 text-success-strong" : "bg-danger/10 text-danger-strong";
    badge = (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}>
        {question.isCorrect ? "Đúng" : answered ? "Sai" : "Bỏ trống"} · {Number(question.earnedScore)}/{Number(question.score)} điểm
      </span>
    );
  } else if (!answered) {
    badge = <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning-strong">Không chọn đáp án</span>;
  }

  return (
    <article className="rounded-xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold text-primary">Câu {index + 1}</p>
        {badge}
      </div>
      <p className="mt-2 whitespace-pre-line text-ink">{question.content}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {question.options.map((option, optionIndex) => {
          const selected = option.id === question.selectedAnswerOptionId;
          let tone = "border-line";
          if (revealed && option.isCorrect) tone = "border-success bg-success/10";
          else if (revealed && selected) tone = "border-danger bg-danger/10";
          else if (selected) tone = "border-primary bg-primary/10 font-semibold";
          return (
            <li key={option.id} className={`flex items-start gap-3 rounded-lg border-2 min-h-12 px-4 py-3 text-sm ${tone}`}>
              <span className="font-semibold text-primary">{String.fromCharCode(65 + optionIndex)}.</span>
              <span className="whitespace-pre-line">{option.content}</span>
              <span className="ml-auto shrink-0 text-xs text-muted">
                {revealed && option.isCorrect && "Đáp án đúng"}
                {revealed && option.isCorrect && selected && " · "}
                {selected && "Bạn đã chọn"}
              </span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
