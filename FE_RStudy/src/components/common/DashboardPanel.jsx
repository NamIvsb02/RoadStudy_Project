import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import ListSkeleton from "./ListSkeleton";
import TableSkeleton from "./TableSkeleton";

export default function DashboardPanel({ title, actions, loading, error, empty, emptyText, skeleton = "list", flush = false, children }) {
  let body = children;
  if (loading) body = skeleton === "table" ? <TableSkeleton /> : <ListSkeleton />;
  else if (error) body = <ErrorState message={error} />;
  else if (empty) body = <EmptyState title={emptyText} />;

  const padded = flush && !loading && !error && !empty ? "" : "p-5";

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {actions}
      </header>
      <div className={`overflow-x-auto ${padded}`}>{body}</div>
    </section>
  );
}
