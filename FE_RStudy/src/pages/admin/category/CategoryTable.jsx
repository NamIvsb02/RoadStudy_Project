import StatusBadge from "../../../components/ui/StatusBadge";

const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";
const actionClass = "text-xs font-semibold text-primary hover:underline disabled:opacity-50";

export default function CategoryTable({ items, busy, onEdit, onToggle, onDelete }) {
  return (
    <table className="w-full min-w-[640px]">
      <thead>
        <tr>
          <th className={th}>Danh mục</th>
          <th className={th}>Mô tả</th>
          <th className={th}>Trạng thái</th>
          <th className={th} />
        </tr>
      </thead>
      <tbody>
        {items.map((category) => (
          <tr key={category.id}>
            <td className={`${td} font-medium`}>{category.categoryName}</td>
            <td className={`${td} max-w-xs`}>
              <p className="line-clamp-2 text-muted">{category.description || "–"}</p>
            </td>
            <td className={td}>
              <StatusBadge type="CategoryStatus" value={category.status} />
            </td>
            <td className={td}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <button type="button" disabled={busy} onClick={() => onEdit(category)} className={actionClass}>
                  Sửa
                </button>
                <button type="button" disabled={busy} onClick={() => onToggle(category)} className={actionClass}>
                  {category.status === "HOAT_DONG" ? "Ẩn" : "Hiển thị"}
                </button>
                <button type="button" disabled={busy} onClick={() => onDelete(category)} className="text-xs font-semibold text-danger hover:underline disabled:opacity-50">
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
