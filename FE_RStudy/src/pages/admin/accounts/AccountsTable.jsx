import Avatar from "../../../components/ui/Avatar";
import StatusBadge from "../../../components/ui/StatusBadge";
import { ROLE_LABELS } from "../../../constants/statuses";
import { formatDate } from "../../../utils/format";

const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";

export default function AccountsTable({ items, canToggle, onToggle }) {
  return (
    <table className="w-full min-w-[720px]">
      <thead>
        <tr>
          <th className={th}>Tài khoản</th>
          <th className={th}>Vai trò</th>
          <th className={th}>Trạng thái</th>
          <th className={th}>Ngày tạo</th>
          <th className={th} />
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td className={td}>
              <div className="flex items-center gap-3">
                <Avatar name={item.fullName} src={item.avatarUrl} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.fullName}</p>
                  <p className="truncate text-xs text-muted">{item.email}</p>
                </div>
              </div>
            </td>
            <td className={td}>{ROLE_LABELS[item.role]}</td>
            <td className={td}>
              <StatusBadge type="AccountStatus" value={item.status} />
            </td>
            <td className={td}>{formatDate(item.createdAt)}</td>
            <td className={`${td} text-right`}>
              {canToggle(item) && (
                <button
                  type="button"
                  onClick={() => onToggle(item)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-soft ${item.status === "BI_KHOA" ? "border-line text-ink" : "border-danger/40 text-danger"}`}
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
