export default function StatusTabs({ tabs, value, onChange, label = "Lọc theo trạng thái" }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {tabs.map(([tabValue, tabLabel]) => (
        <button
          key={tabValue}
          type="button"
          aria-pressed={value === tabValue}
          onClick={() => onChange(tabValue)}
          className={`min-h-11 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light ${
            value === tabValue ? "border-primary bg-primary text-white" : "border-line bg-white text-ink hover:bg-primary-50"
          }`}
        >
          {tabLabel}
        </button>
      ))}
    </div>
  );
}
