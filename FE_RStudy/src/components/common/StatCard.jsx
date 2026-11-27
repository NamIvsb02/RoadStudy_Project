import { Link } from "react-router-dom";

export default function StatCard({ label, value, loading = false, error = "", to, actionLabel, icon: Icon }) {
  const display = loading ? "..." : error || value == null ? "–" : Number(value).toLocaleString("vi-VN");

  return (
    <div className="flex items-start gap-4 rounded-xl border border-line bg-white p-5">
      {Icon && (
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
          <Icon size={20} aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-1 text-3xl font-bold text-ink">{display}</p>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        {to && !error && (
          <Link
            to={to}
            className="mt-3 inline-flex min-h-11 items-center rounded-lg px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-light"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
