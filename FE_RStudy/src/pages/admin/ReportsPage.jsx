import { useCallback, useState } from "react";
import { reportApi } from "../../api/reportApi";
import DashboardPanel from "../../components/common/DashboardPanel";
import Pagination from "../../components/ui/Pagination";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import ReportActionDialog from "./reports/ReportActionDialog";
import ReportCard from "./reports/ReportCard";

const LIMIT = 10;
const TABS = ["CHO_XU_LY", "DANG_XU_LY", "DA_XU_LY", "TU_CHOI"];

export default function ReportsPage() {
  const [tab, setTab] = useState("CHO_XU_LY");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const request = useCallback(() => reportApi.getList({ status: tab, page, limit: LIMIT }), [tab, page]);
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];

  const handleTab = (value) => {
    setTab(value);
    setPage(1);
  };

  const refresh = () => {
    if (items.length === 1 && page > 1) setPage(page - 1);
    else reload();
  };

  const handleStart = async (report) => {
    setBusy(true);
    setActionError("");
    try {
      await reportApi.process(report.id, { status: "DANG_XU_LY" });
      refresh();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (text) => {
    const { type, report } = action;
    if (type === "resolve") await reportApi.process(report.id, { status: "DA_XU_LY", resolutionResult: text });
    else await reportApi.reject(report.id, text);
    setAction(null);
    refresh();
  };

  const openResolve = (report) => setAction({ type: "resolve", report, title: "Xác nhận nội dung vi phạm", label: "Kết quả xử lý", confirmLabel: "Xác nhận vi phạm" });
  const openReject = (report) => setAction({ type: "reject", report, title: "Từ chối báo cáo", label: "Lý do từ chối", confirmLabel: "Từ chối", danger: true });

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" className="flex flex-wrap gap-2">
        {TABS.map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => handleTab(value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === value ? "bg-primary text-white" : "bg-white text-ink hover:bg-soft"}`}
          >
            {STATUS_MAPS.ReportStatus[value].label}
          </button>
        ))}
      </div>
      {actionError && (
        <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {actionError}
        </p>
      )}
      <DashboardPanel title="Báo cáo vi phạm" loading={loading} error={error} empty={items.length === 0} emptyText="Không có báo cáo nào trong mục này.">
        <div className="flex flex-col gap-3">
          {items.map((report) => (
            <ReportCard key={report.id} report={report} busy={busy} onStart={handleStart} onResolve={openResolve} onReject={openReject} />
          ))}
        </div>
      </DashboardPanel>
      <Pagination page={page} totalPages={data?.pagination.totalPages} onChange={setPage} />
      <ReportActionDialog action={action} onSubmit={handleSubmit} onCancel={() => setAction(null)} />
    </div>
  );
}
