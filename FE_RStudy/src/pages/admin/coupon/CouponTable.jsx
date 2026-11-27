import StatusBadge from "../../../components/ui/StatusBadge";
import { formatDate, formatVND } from "../../../utils/format";
import { ACTION_DANGER, ACTION_LINK, ACTIONS, TABLE, TBODY, TD, TD_ACTION, TH, TR } from "../../manage/tableStyles";

const discountText = (coupon) => (coupon.discountAmount ? formatVND(coupon.discountAmount) : `${Number(coupon.discountPercentage)}%`);

export default function CouponTable({ items, busy, onEdit, onToggle, onDelete }) {
  return (
    <table className={`${TABLE} min-w-[820px]`}>
      <thead>
        <tr>
          <th className={TH}>Mã</th>
          <th className={TH}>Giảm</th>
          <th className={TH}>Hiệu lực</th>
          <th className={TH}>Đã dùng</th>
          <th className={TH}>Trạng thái</th>
          <th className={TH} />
        </tr>
      </thead>
      <tbody className={TBODY}>
        {items.map((coupon) => (
          <tr key={coupon.id} className={TR}>
            <td className={`${TD} font-mono font-semibold`}>{coupon.code}</td>
            <td className={TD}>{discountText(coupon)}</td>
            <td className={TD}>
              {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
            </td>
            <td className={TD}>
              {coupon.usedCount}/{coupon.usageLimit}
            </td>
            <td className={TD}>
              <StatusBadge type="DiscountStatus" value={coupon.status} />
            </td>
            <td className={TD_ACTION}>
              <div className={ACTIONS}>
                <button type="button" disabled={busy} onClick={() => onEdit(coupon)} className={ACTION_LINK}>
                  Sửa
                </button>
                {coupon.status !== "HET_HAN" && (
                  <button type="button" disabled={busy} onClick={() => onToggle(coupon)} className={ACTION_LINK}>
                    {coupon.status === "HOAT_DONG" ? "Tạm ngưng" : "Kích hoạt"}
                  </button>
                )}
                {coupon.usedCount === 0 && (
                  <button type="button" disabled={busy} onClick={() => onDelete(coupon)} className={ACTION_DANGER}>
                    Xóa
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
