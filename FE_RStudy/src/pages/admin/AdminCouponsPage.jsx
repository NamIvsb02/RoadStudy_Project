import { useCallback, useState } from "react";
import { couponApi } from "../../api/couponApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DashboardPanel from "../../components/common/DashboardPanel";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import CouponDialog from "./coupon/CouponDialog";
import CouponTable from "./coupon/CouponTable";

const LIMIT = 10;
const TABS = [["", "Tất cả"], ...Object.entries(STATUS_MAPS.DiscountStatus).map(([value, { label }]) => [value, label])];

export default function AdminCouponsPage() {
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const request = useCallback(() => couponApi.getList({ ...(status && { status }), ...(search && { q: search }), page, limit: LIMIT }), [status, search, page]);
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];
  const isDelete = confirm?.type === "delete";
  const locking = confirm?.coupon.status === "HOAT_DONG";

  const handleTab = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(keyword.trim());
    setPage(1);
  };

  const handleSave = async (body) => {
    if (dialog.coupon) await couponApi.update(dialog.coupon.id, body);
    else await couponApi.create(body);
    setDialog(null);
    reload();
  };

  const handleConfirm = async () => {
    const { type, coupon } = confirm;
    setConfirm(null);
    setBusy(true);
    setActionError("");
    try {
      if (type === "delete") await couponApi.remove(coupon.id);
      else await couponApi.changeStatus(coupon.id, coupon.status === "HOAT_DONG" ? "TAM_NGUNG" : "HOAT_DONG");
      if (type === "delete" && items.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  let title = "";
  if (confirm) title = isDelete ? "Xóa mã giảm giá?" : locking ? "Tạm ngưng mã giảm giá?" : "Kích hoạt lại mã giảm giá?";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" className="flex flex-wrap gap-2">
          {TABS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={status === value}
              onClick={() => handleTab(value)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${status === value ? "bg-primary text-white" : "bg-white text-ink hover:bg-soft"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <Button onClick={() => setDialog({ coupon: null })}>Tạo mã giảm giá</Button>
      </div>
      <form role="search" onSubmit={handleSearch}>
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo mã, nhấn Enter"
          aria-label="Tìm mã giảm giá"
          className="h-10 w-full max-w-md rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/30"
        />
      </form>
      {actionError && (
        <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {actionError}
        </p>
      )}
      <DashboardPanel title="Mã giảm giá" loading={loading} error={error} empty={items.length === 0} emptyText="Chưa có mã giảm giá nào.">
        <CouponTable
          items={items}
          busy={busy}
          onEdit={(coupon) => setDialog({ coupon })}
          onToggle={(coupon) => setConfirm({ type: "toggle", coupon })}
          onDelete={(coupon) => setConfirm({ type: "delete", coupon })}
        />
      </DashboardPanel>
      <Pagination page={page} totalPages={data?.pagination.totalPages} onChange={setPage} />
      <CouponDialog dialog={dialog} onSubmit={handleSave} onClose={() => setDialog(null)} />
      <ConfirmDialog
        open={Boolean(confirm)}
        title={title}
        message={confirm?.coupon.code}
        confirmLabel={isDelete ? "Xóa" : locking ? "Tạm ngưng" : "Kích hoạt"}
        danger={isDelete || locking}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
