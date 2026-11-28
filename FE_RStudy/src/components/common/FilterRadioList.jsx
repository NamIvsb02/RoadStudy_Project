// options: [{ value, label, count? }]; mục đầu tiên thường là "Tất cả" với value ""
export default function FilterRadioList({ name, options, value, onChange, scroll = false }) {
  return (
    <div role="radiogroup" className={`flex flex-col gap-0.5 ${scroll ? "max-h-64 overflow-y-auto pr-1" : ""}`}>
      {options.map((option) => (
        <label
          key={option.value || "all"}
          className={`flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-2 text-sm transition-colors duration-150 hover:bg-surface ${value === option.value ? "font-semibold text-primary" : "text-ink"}`}
        >
          <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="size-4 shrink-0 accent-primary" />
          <span className="min-w-0 flex-1 truncate">{option.label}</span>
          {option.count !== undefined && <span className="text-xs text-muted">{option.count}</span>}
        </label>
      ))}
    </div>
  );
}
