import StatusBadge from "../../../components/ui/StatusBadge";
import { formatDateTime, formatVND } from "../../../utils/format";

const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";

export default function PaymentTable({ items, onView }) {
  return (
    <table className="w-full min-w-[820px]">
      <thead>
        <tr>
          <th className={th}>Học viên</th>
          <th className={th}>Khóa học</th>
          <th className={th}>Số tiền</th>
          <th className={th}>Minh chứng</th>
          <th className={th}>Trạng thái</th>
          <th className={th}>Thanh toán lúc</th>
          <th className={th} />
        </tr>
      </thead>
      <tbody>
        {items.map((invoice) => (
          <tr key={invoice.id}>
            <td className={td}>
              <p className="font-medium">{invoice.student.account.fullName}</p>
              <p className="text-xs text-muted">{invoice.student.account.email}</p>
            </td>
            <td className={td}>{invoice.registration.course.courseName}</td>
            <td className={td}>{formatVND(invoice.totalAmount)}</td>
            <td className={td}>{invoice.hasPaymentProof ? "Đã gửi" : "Chưa có"}</td>
            <td className={td}>
              <StatusBadge type="InvoiceStatus" value={invoice.status} />
            </td>
            <td className={td}>{invoice.paidAt ? formatDateTime(invoice.paidAt) : "–"}</td>
            <td className={td}>
              <button type="button" onClick={() => onView(invoice)} className="text-xs font-semibold text-primary hover:underline">
                Xem
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
