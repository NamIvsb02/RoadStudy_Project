import StatusBadge from "../../../components/ui/StatusBadge";
import { formatDate, formatVND } from "../../../utils/format";

const th = "bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary";
const td = "border-b border-line px-3 py-2.5 text-sm text-ink";
const actionClass = "text-xs font-semibold text-primary hover:underline disabled:opacity-50";

const discountText = (coupon) => (coupon.discountAmount ? formatVND(coupon.discountAmount) : `${Number(coupon.discountPercentage)}%`);

export default function CouponTable({ items, busy, onEdit, onToggle, onDelete }) {
  return (
    <table className="w-full min-w-[820px]">
      <thead>
        <tr>
          <th className={th}>Mã</th>
          <th className={th}>Giảm</th>
          <th className={th}>Hiệu lực</th>
          <th className={th}>Đã dùng</th>
          <th className={th}>Trạng thái</th>
          <th className={th} />
        </tr>
      </thead>
      <tbody>
        {items.map((coupon) => (
          <tr key={coupon.id}>
            <td className={`${td} font-mono font-semibold`}>{coupon.code}</td>
            <td className={td}>{discountText(coupon)}</td>
            <td className={td}>
              {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
            </td>
            <td className={td}>
              {coupon.usedCount}/{coupon.usageLimit}
            </td>
            <td className={td}>
              <StatusBadge type="DiscountStatus" value={coupon.status} />
            </td>
            <td className={td}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <button type="button" disabled={busy} onClick={() => onEdit(coupon)} className={actionClass}>
                  Sửa
                </button>
                {coupon.status !== "HET_HAN" && (
                  <button type="button" disabled={busy} onClick={() => onToggle(coupon)} className={actionClass}>
                    {coupon.status === "HOAT_DONG" ? "Tạm ngưng" : "Kích hoạt"}
                  </button>
                )}
                {coupon.usedCount === 0 && (
                  <button type="button" disabled={busy} onClick={() => onDelete(coupon)} className="text-xs font-semibold text-danger hover:underline disabled:opacity-50">
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
