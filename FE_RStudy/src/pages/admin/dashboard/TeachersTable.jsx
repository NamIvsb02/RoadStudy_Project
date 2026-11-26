import { Link } from "react-router-dom";
import DashboardPanel from "../../../components/common/DashboardPanel";
import { ROUTES } from "../../../constants/routes";
import { useFetch } from "../../../hooks/useFetch";
import { fetchPendingTeachers } from "./dashboardConfig";
import { ACTION_LINK, TABLE, TBODY, TD, TD_ACTION, TH, TR } from "../../manage/tableStyles";

export default function TeachersTable() {
  const { data, loading, error } = useFetch(fetchPendingTeachers);
  const items = data?.items ?? [];

  return (
    <DashboardPanel
      title="Giáo viên chờ duyệt"
      skeleton="table"
      flush
      loading={loading}
      error={error}
      empty={items.length === 0}
      emptyText="Không có giáo viên nào đang chờ duyệt."
    >
      <table className={TABLE}>
        <thead>
          <tr>
            <th className={TH}>Họ tên</th>
            <th className={TH}>Chuyên môn</th>
            <th className={TH} />
          </tr>
        </thead>
        <tbody className={TBODY}>
          {items.map((teacher) => (
            <tr key={teacher.id} className={TR}>
              <td className={TD}>{teacher.account.fullName}</td>
              <td className={TD}>{teacher.specialization}</td>
              <td className={TD_ACTION}>
                <Link to={ROUTES.ADMIN.TEACHER_APPROVAL} className={ACTION_LINK}>
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
