export default function FilterSection({ title, aside, children }) {
  return (
    <section className="py-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">{title}</h3>
        {aside && <span className="text-xs font-semibold text-ink-strong">{aside}</span>}
      </div>
      {children}
    </section>
  );
}
