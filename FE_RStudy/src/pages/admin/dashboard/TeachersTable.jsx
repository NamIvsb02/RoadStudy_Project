import { Link } from "react-router-dom";
import DashboardPanel from "../../../components/common/DashboardPanel";
import { ROUTES } from "../../../constants/routes";
import { useFetch } from "../../../hooks/useFetch";
import { fetchPendingTeachers } from "./dashboardConfig";

const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";

export default function TeachersTable() {
  const { data, loading, error } = useFetch(fetchPendingTeachers);
  const items = data?.items ?? [];

  return (
    <DashboardPanel title="Giáo viên chờ duyệt" loading={loading} error={error} empty={items.length === 0} emptyText="Không có giáo viên nào đang chờ duyệt.">
      <table className="w-full">
        <thead>
          <tr>
            <th className={th}>Họ tên</th>
            <th className={th}>Chuyên môn</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {items.map((teacher) => (
            <tr key={teacher.id}>
              <td className={td}>{teacher.account.fullName}</td>
              <td className={td}>{teacher.specialization}</td>
              <td className={td}>
                <Link to={ROUTES.ADMIN.TEACHER_APPROVAL} className="text-xs font-semibold text-primary hover:underline">
                  Xem xét
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardPanel>
  );
}
