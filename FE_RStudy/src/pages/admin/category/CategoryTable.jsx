import StatusBadge from "../../../components/ui/StatusBadge";
import { ACTION_DANGER, ACTION_LINK, ACTIONS, TABLE, TBODY, TD, TD_ACTION, TH, TR } from "../../manage/tableStyles";

export default function CategoryTable({ items, busy, onEdit, onToggle, onDelete }) {
  return (
    <table className={`${TABLE} min-w-[640px]`}>
      <thead>
        <tr>
          <th className={TH}>Danh mục</th>
          <th className={TH}>Mô tả</th>
          <th className={TH}>Trạng thái</th>
          <th className={TH} />
        </tr>
      </thead>
      <tbody className={TBODY}>
        {items.map((category) => (
          <tr key={category.id} className={TR}>
            <td className={`${TD} font-medium`}>{category.categoryName}</td>
            <td className={`${TD} max-w-xs`}>
              <p className="line-clamp-2 text-muted">{category.description || "–"}</p>
            </td>
            <td className={TD}>
              <StatusBadge type="CategoryStatus" value={category.status} />
            </td>
            <td className={TD_ACTION}>
              <div className={ACTIONS}>
                <button type="button" disabled={busy} onClick={() => onEdit(category)} className={ACTION_LINK}>
                  Sửa
                </button>
                <button type="button" disabled={busy} onClick={() => onToggle(category)} className={ACTION_LINK}>
                  {category.status === "HOAT_DONG" ? "Ẩn" : "Hiển thị"}
                </button>
                <button type="button" disabled={busy} onClick={() => onDelete(category)} className={ACTION_DANGER}>
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
