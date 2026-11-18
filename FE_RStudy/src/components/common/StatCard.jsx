import { Link } from "react-router-dom";

export default function StatCard({ label, value, loading = false, error = "", to, actionLabel }) {
  const display = loading ? "..." : error || value == null ? "–" : Number(value).toLocaleString("vi-VN");

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1.5 text-3xl font-bold text-primary">{display}</p>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {to && !error && (
        <Link to={to} className="mt-3 inline-block rounded-lg bg-soft px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
