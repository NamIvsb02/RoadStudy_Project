export default function QuestionCard({ index, question, selectedId, highlighted, disabled, onSelect }) {
  return (
    <article id={`q-${question.id}`} className={`rounded-xl border bg-white p-5 ${highlighted ? "border-accent" : "border-line"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold text-primary">Câu {index + 1}</p>
        {highlighted && <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">Chưa chọn đáp án</span>}
      </div>
      <p className="mt-2 whitespace-pre-line text-ink">{question.content}</p>
      <div role="radiogroup" aria-label={`Câu ${index + 1}`} className="mt-3 flex flex-col gap-2">
        {question.options.map((option, optionIndex) => {
          const selected = selectedId === option.id;
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 px-4 py-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40 ${
                selected ? "border-primary bg-primary/10 font-semibold" : "border-line hover:bg-soft"
              } ${disabled ? "pointer-events-none opacity-70" : ""}`}
            >
              <input type="radio" name={question.id} checked={selected} disabled={disabled} onChange={() => onSelect(question.id, option.id)} className="sr-only" />
              <span className="font-semibold text-primary">{String.fromCharCode(65 + optionIndex)}.</span>
              <span className="whitespace-pre-line">{option.content}</span>
            </label>
          );
        })}
      </div>
    </article>
  );
}
