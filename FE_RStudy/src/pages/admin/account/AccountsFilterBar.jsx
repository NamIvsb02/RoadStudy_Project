import { useState } from "react";
import { ROLE_LABELS, STATUS_MAPS } from "../../../constants/statuses";

const fieldClass = "h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/30";

export default function AccountsFilterBar({ filters, onChange }) {
  const [keyword, setKeyword] = useState(filters.search);

  const handleSubmit = (event) => {
    event.preventDefault();
    onChange({ ...filters, search: keyword.trim() });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <form role="search" onSubmit={handleSubmit} className="flex-1">
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên hoặc email, nhấn Enter"
          aria-label="Tìm tài khoản"
          className={`${fieldClass} w-full`}
        />
      </form>
      <select aria-label="Lọc theo vai trò" value={filters.role} onChange={(event) => onChange({ ...filters, role: event.target.value })} className={fieldClass}>
        <option value="">Tất cả vai trò</option>
        {Object.entries(ROLE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select aria-label="Lọc theo trạng thái" value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value })} className={fieldClass}>
        <option value="">Tất cả trạng thái</option>
        {Object.entries(STATUS_MAPS.AccountStatus).map(([value, { label }]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
