import StatusBadge from "../../../components/ui/StatusBadge";
import { formatDateTime, formatVND } from "../../../utils/format";
import { ACTION_LINK, TABLE, TBODY, TD, TD_ACTION, TH, TR } from "../../manage/tableStyles";

export default function PaymentTable({ items, onView }) {
  return (
    <table className={`${TABLE} min-w-[820px]`}>
      <thead>
        <tr>
          <th className={TH}>Học viên</th>
          <th className={TH}>Khóa học</th>
          <th className={TH}>Số tiền</th>
          <th className={TH}>Minh chứng</th>
          <th className={TH}>Trạng thái</th>
          <th className={TH}>Thanh toán lúc</th>
          <th className={TH} />
        </tr>
      </thead>
      <tbody className={TBODY}>
        {items.map((invoice) => (
          <tr key={invoice.id} className={TR}>
            <td className={TD}>
              <p className="font-medium">{invoice.student.account.fullName}</p>
              <p className="text-xs text-muted">{invoice.student.account.email}</p>
            </td>
            <td className={TD}>{invoice.registration.course.courseName}</td>
            <td className={TD}>{formatVND(invoice.totalAmount)}</td>
            <td className={TD}>{invoice.hasPaymentProof ? "Đã gửi" : "Chưa có"}</td>
            <td className={TD}>
              <StatusBadge type="InvoiceStatus" value={invoice.status} />
            </td>
            <td className={TD}>{invoice.paidAt ? formatDateTime(invoice.paidAt) : "–"}</td>
            <td className={TD_ACTION}>
              <button type="button" onClick={() => onView(invoice)} className={ACTION_LINK}>
                Xem
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
