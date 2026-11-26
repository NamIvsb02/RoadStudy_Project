import { Link } from "react-router-dom";
import DashboardPanel from "../../../components/common/DashboardPanel";
import { ROUTES } from "../../../constants/routes";
import { useFetch } from "../../../hooks/useFetch";
import { fetchPendingPayments } from "./dashboardConfig";
import { ACTION_LINK, TABLE, TBODY, TD, TD_ACTION, TH, TR } from "../../manage/tableStyles";

export default function PaymentsTable() {
  const { data, loading, error } = useFetch(fetchPendingPayments);
  const items = data?.items ?? [];

  return (
    <DashboardPanel title="Thanh toán chờ xác nhận" skeleton="table" flush loading={loading} error={error} empty={items.length === 0} emptyText="Không có thanh toán nào đang chờ.">
      <table className={TABLE}>
        <thead>
          <tr>
            <th className={TH}>Học viên</th>
            <th className={TH}>Khóa học</th>
            <th className={TH}>Số tiền</th>
            <th className={TH} />
          </tr>
        </thead>
        <tbody className={TBODY}>
          {items.map((invoice) => (
            <tr key={invoice.id} className={TR}>
              <td className={TD}>{invoice.student.account.fullName}</td>
              <td className={TD}>{invoice.registration.course.courseName}</td>
              <td className={TD}>{Number(invoice.totalAmount).toLocaleString("vi-VN")}đ</td>
              <td className={TD_ACTION}>
                <Link to={ROUTES.ADMIN.PAYMENTS} className={ACTION_LINK}>
                  Xem
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardPanel>
  );
}
