export default function QuestionCard({ index, question, selectedId, highlighted, disabled, onSelect }) {
  return (
    <article id={`q-${question.id}`} className={`rounded-xl border bg-white p-5 ${highlighted ? "border-accent" : "border-line"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold text-primary">Câu {index + 1}</p>
        {highlighted && <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning-strong">Chưa chọn đáp án</span>}
      </div>
      <p className="mt-2 whitespace-pre-line text-ink">{question.content}</p>
      <div role="radiogroup" aria-label={`Câu ${index + 1}`} className="mt-4 flex flex-col gap-2.5">
        {question.options.map((option, optionIndex) => {
          const selected = selectedId === option.id;
          return (
            <label
              key={option.id}
              className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border-2 px-4 py-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-light/60 ${
                selected ? "border-primary bg-primary-50 font-semibold text-ink-strong" : "border-line text-ink hover:border-line-strong hover:bg-surface"
              } ${disabled ? "pointer-events-none opacity-70" : ""}`}
            >
              <input type="radio" name={question.id} checked={selected} disabled={disabled} onChange={() => onSelect(question.id, option.id)} className="sr-only" />
              <span aria-hidden="true" className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-line-strong bg-white"}`}>
                {selected && <span className="size-2 rounded-full bg-white" />}
              </span>
              <span className="font-semibold text-primary">{String.fromCharCode(65 + optionIndex)}.</span>
              <span className="whitespace-pre-line">{option.content}</span>
            </label>
          );
        })}
      </div>
    </article>
  );
}
