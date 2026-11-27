import StatusBadge from "../../../components/ui/StatusBadge";

export default function AdminList({ items, selectedId, onSelect }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((admin) => (
        <li key={admin.id}>
          <button
            type="button"
            onClick={() => onSelect(admin.id)}
            aria-current={admin.id === selectedId}
            className={`min-h-11 w-full rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary-light ${admin.id === selectedId ? "bg-primary-100" : "hover:bg-primary-50"}`}
          >
            <p className="truncate text-sm font-semibold text-ink">{admin.fullName}</p>
            <p className="truncate text-xs text-muted">{admin.email}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {admin.isLeader && <span className="inline-flex rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-white">Trưởng</span>}
              <StatusBadge type="AccountStatus" value={admin.status} />
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
