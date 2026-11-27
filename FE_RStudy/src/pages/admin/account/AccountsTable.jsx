import Avatar from "../../../components/ui/Avatar";
import StatusBadge from "../../../components/ui/StatusBadge";
import { ROLE_LABELS } from "../../../constants/statuses";
import { formatDate } from "../../../utils/format";
import { TABLE, TBODY, TD, TD_ACTION, TH, TR } from "../../manage/tableStyles";

export default function AccountsTable({ items, canToggle, onToggle }) {
  return (
    <table className={`${TABLE} min-w-[720px]`}>
      <thead>
        <tr>
          <th className={TH}>Tài khoản</th>
          <th className={TH}>Vai trò</th>
          <th className={TH}>Trạng thái</th>
          <th className={TH}>Ngày tạo</th>
          <th className={TH} />
        </tr>
      </thead>
      <tbody className={TBODY}>
        {items.map((item) => (
          <tr key={item.id} className={TR}>
            <td className={TD}>
              <div className="flex items-center gap-3">
                <Avatar name={item.fullName} src={item.avatarUrl} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.fullName}</p>
                  <p className="truncate text-xs text-muted">{item.email}</p>
                </div>
              </div>
            </td>
            <td className={TD}>{ROLE_LABELS[item.role]}</td>
            <td className={TD}>
              <StatusBadge type="AccountStatus" value={item.status} />
            </td>
            <td className={TD}>{formatDate(item.createdAt)}</td>
            <td className={TD_ACTION}>
              {canToggle(item) && (
                <button
                  type="button"
                  onClick={() => onToggle(item)}
                  className={`inline-flex min-h-11 items-center rounded-lg border px-3 text-xs font-semibold transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-primary-light ${item.status === "BI_KHOA" ? "border-line text-ink" : "border-danger/40 text-danger"}`}
                >
                  {item.status === "BI_KHOA" ? "Mở khóa" : "Khóa"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
