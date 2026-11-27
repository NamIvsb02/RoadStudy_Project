import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { invoiceApi } from "../../api/invoiceApi";
import DashboardPanel from "../../components/common/DashboardPanel";
import Pagination from "../../components/common/Pagination";
import { useFetch } from "../../hooks/useFetch";
import PaymentDetailDialog from "./payment/PaymentDetailDialog";
import PaymentTable from "./payment/PaymentTable";
import StatusTabs from "../manage/StatusTabs";
import SearchField from "../manage/SearchField";

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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const request = useCallback(
    () =>
      invoiceApi.getList({
        ...toParams(tab),
        ...(search && { q: search }),
        page,
        limit: LIMIT,
      }),
    [tab, search, page],
  );
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];

  const handleTab = (value) => {
    setTab(value);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleDone = () => {
    setSelected(null);
    reload();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <StatusTabs tabs={TABS} value={tab} onChange={handleTab} />
        <SearchField placeholder="Tìm theo tên hoặc email học viên, nhấn Enter" label="Tìm hóa đơn" onSearch={handleSearch} />
      </div>
      <DashboardPanel title="Hóa đơn" skeleton="table" flush loading={loading} error={error} empty={items.length === 0} emptyText="Không có hóa đơn nào trong mục này.">
        <PaymentTable items={items} onView={setSelected} />
      </DashboardPanel>
      <Pagination pagination={data?.pagination} onChange={setPage} />
      <PaymentDetailDialog invoice={selected} onClose={() => setSelected(null)} onDone={handleDone} />
    </div>
  );
}
