export default function QuestionReview({ index, question }) {
  const answered = Boolean(question.selectedAnswerOptionId);

  return (
    <article className="rounded-xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold text-primary">Câu {index + 1}</p>
        {!answered && <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">Không chọn đáp án</span>}
      </div>
      <p className="mt-2 whitespace-pre-line text-ink">{question.content}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {question.options.map((option, optionIndex) => {
          const selected = option.id === question.selectedAnswerOptionId;
          return (
            <li key={option.id} className={`flex items-start gap-3 rounded-lg border-2 px-4 py-3 text-sm ${selected ? "border-primary bg-primary/10 font-semibold" : "border-line"}`}>
              <span className="font-semibold text-primary">{String.fromCharCode(65 + optionIndex)}.</span>
              <span className="whitespace-pre-line">{option.content}</span>
              {selected && <span className="ml-auto shrink-0 text-xs text-primary">Bạn đã chọn</span>}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
