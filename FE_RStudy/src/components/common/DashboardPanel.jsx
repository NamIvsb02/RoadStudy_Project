import LoadingState from "../ui/LoadingState";

export default function DashboardPanel({ title, loading, error, empty, emptyText, children }) {
  let body = <div className="overflow-x-auto">{children}</div>;
  if (loading) body = <LoadingState />;
  else if (error) body = <p className="py-6 text-center text-sm text-danger">{error}</p>;
  else if (empty) body = <p className="py-6 text-center text-sm text-muted">{emptyText}</p>;

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="mb-3 text-base font-semibold text-ink">{title}</h2>
      {body}
    </section>
  );
}
