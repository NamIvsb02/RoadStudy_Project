import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { invoiceApi } from "../../api/invoiceApi";
import DashboardPanel from "../../components/common/DashboardPanel";
import Pagination from "../../components/ui/Pagination";
import { useFetch } from "../../hooks/useFetch";
import PaymentDetailDialog from "./payment/PaymentDetailDialog";
import PaymentTable from "./payment/PaymentTable";

const LIMIT = 10;
const TABS = [
  ["", "Tất cả"],
  ["pending", "Chờ xác nhận"],
  ["DA_THANH_TOAN", "Đã thanh toán"],
  ["THAT_BAI", "Bị từ chối"],
  ["HOAN_TIEN", "Đã hoàn tiền"],
  ["DA_HUY", "Đã hủy"],
];

const toParams = (tab) => {
  if (tab === "pending") return { pending: true };
  return tab ? { status: tab } : {};
};

export default function AdminPaymentsPage() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(TABS.some(([value]) => value === params.get("tab")) ? params.get("tab") : "");
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const request = useCallback(() => invoiceApi.getList({ ...toParams(tab), ...(search && { q: search }), page, limit: LIMIT }), [tab, search, page]);
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];

  const handleTab = (value) => {
    setTab(value);
    setPage(1);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(keyword.trim());
    setPage(1);
  };

  const handleDone = () => {
    setSelected(null);
    reload();
  };

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" className="flex flex-wrap gap-2">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => handleTab(value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === value ? "bg-primary text-white" : "bg-white text-ink hover:bg-soft"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <form role="search" onSubmit={handleSearch}>
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên hoặc email học viên, nhấn Enter"
          aria-label="Tìm hóa đơn"
          className="h-10 w-full max-w-md rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/30"
        />
      </form>
      <DashboardPanel title="Hóa đơn" loading={loading} error={error} empty={items.length === 0} emptyText="Không có hóa đơn nào trong mục này.">
        <PaymentTable items={items} onView={setSelected} />
      </DashboardPanel>
      <Pagination page={page} totalPages={data?.pagination.totalPages} onChange={setPage} />
      <PaymentDetailDialog invoice={selected} onClose={() => setSelected(null)} onDone={handleDone} />
    </div>
  );
}
