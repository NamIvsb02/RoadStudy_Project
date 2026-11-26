import { useCallback, useState } from "react";
import { invoiceApi } from "../../api/invoiceApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DashboardPanel from "../../components/common/DashboardPanel";
import NoteDialog from "../../components/common/NoteDialog";
import Pagination from "../../components/common/Pagination";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import RefundCard from "./refund/RefundCard";
import StatusTabs from "../manage/StatusTabs";
import ActionError from "../manage/ActionError";

const LIMIT = 10;
const TABS = [["", "Tất cả"], ...Object.entries(STATUS_MAPS.SupportRequestStatus).map(([value, { label }]) => [value, label])];
const CONFIRMS = {
  approve: {
    title: "Chấp thuận hoàn tiền?",
    message: "Học viên sẽ được báo là yêu cầu đã được chấp thuận. Đơn chưa bị đổi trạng thái cho đến khi bạn xác nhận đã hoàn tiền.",
    label: "Chấp thuận",
  },
  complete: {
    title: "Xác nhận đã hoàn tiền?",
    message: "Chỉ bấm khi bạn đã chuyển khoản hoàn tiền cho học viên. Đơn đăng ký và hóa đơn sẽ chuyển sang Đã hoàn tiền.",
    label: "Đã hoàn tiền",
  },
};

export default function AdminRefundsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState(null);
  const [cancelRegistration, setCancelRegistration] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const request = useCallback(
    () =>
      invoiceApi.getRefundRequests({
        ...(status && { status }),
        page,
        limit: LIMIT,
      }),
    [status, page],
  );
  const { data, loading, error, reload } = useFetch(request);
  const items = data?.items ?? [];
  const confirm = action && action.type !== "reject" ? CONFIRMS[action.type] : null;
  const unpaid = action?.request.invoice?.status === "CHO_THANH_TOAN";

  const handleTab = (value) => {
    setStatus(value);
    setPage(1);
  };

  const open = (type) => (request) => {
    setCancelRegistration(false);
    setAction({ type, request });
  };

  const handleConfirm = async () => {
    const { type, request: target } = action;
    setAction(null);
    setBusy(true);
    setActionError("");
    try {
      await (type === "approve" ? invoiceApi.approveRefund(target.id) : invoiceApi.completeRefund(target.id));
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async (note) => {
    await invoiceApi.rejectRefund(action.request.id, note, unpaid && cancelRegistration);
    setAction(null);
    reload();
  };

  return (
    <div className="flex flex-col gap-4">
      <StatusTabs tabs={TABS} value={status} onChange={handleTab} />
      <ActionError message={actionError} />
      <DashboardPanel title="Yêu cầu hoàn tiền" loading={loading} error={error} empty={items.length === 0} emptyText="Không có yêu cầu nào trong mục này.">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <RefundCard key={item.id} request={item} busy={busy} onApprove={open("approve")} onComplete={open("complete")} onReject={open("reject")} />
          ))}
        </div>
      </DashboardPanel>
      <Pagination pagination={data?.pagination} onChange={setPage} />
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.label}
        onConfirm={handleConfirm}
        onCancel={() => setAction(null)}
      />
      <NoteDialog
        open={action?.type === "reject"}
        title="Từ chối yêu cầu hoàn tiền"
        label="Lý do từ chối"
        confirmLabel="Từ chối"
        danger
        onSubmit={handleReject}
        onCancel={() => setAction(null)}
      >
        {unpaid && (
          <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
            <input type="checkbox" checked={cancelRegistration} onChange={(event) => setCancelRegistration(event.target.checked)} className="mt-0.5 size-4 accent-primary" />
            Đồng thời hủy đơn đăng ký (chỉ dùng khi chưa có giao dịch thực tế)
          </label>
        )}
      </NoteDialog>
    </div>
  );
}
