import { Link } from "react-router-dom";
import DashboardPanel from "../../../components/common/DashboardPanel";
import { ROUTES } from "../../../constants/routes";
import { useFetch } from "../../../hooks/useFetch";
import { fetchPendingPayments } from "./dashboardConfig";

const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";

export default function PaymentsTable() {
  const { data, loading, error } = useFetch(fetchPendingPayments);
  const items = data?.items ?? [];

  return (
    <DashboardPanel title="Thanh toán chờ xác nhận" loading={loading} error={error} empty={items.length === 0} emptyText="Không có thanh toán nào đang chờ.">
      <table className="w-full">
        <thead>
          <tr>
            <th className={th}>Học viên</th>
            <th className={th}>Khóa học</th>
            <th className={th}>Số tiền</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {items.map((invoice) => (
            <tr key={invoice.id}>
              <td className={td}>{invoice.student.account.fullName}</td>
              <td className={td}>{invoice.registration.course.courseName}</td>
              <td className={td}>{Number(invoice.totalAmount).toLocaleString("vi-VN")}đ</td>
              <td className={td}>
                <Link to={ROUTES.ADMIN.PAYMENTS} className="text-xs font-semibold text-primary hover:underline">
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
