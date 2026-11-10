import { useCallback, useMemo, useState } from "react";
import { enrollmentApi } from "../../api/enrollmentApi";
import { invoiceApi } from "../../api/invoiceApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import PaymentModal from "../../components/common/payment/PaymentModal";
import RefundRequestModal from "../../components/common/payment/RefundRequestModal";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import Pagination from "../../components/ui/Pagination";
import { inputClass } from "../../components/ui/inputClass";
import { STATUS_MAPS } from "../../constants/statuses";
import { useFetch } from "../../hooks/useFetch";
import { useToast } from "../../hooks/useToast";
import { PENDING_REFUND_STATUSES } from "../../utils/paymentState";
import MyCourseCard from "./MyCourseCard";

const PAGE_SIZE = 9;
const STATUS_OPTIONS = Object.entries(STATUS_MAPS.RegistrationStatus).map(([value, { label }]) => ({ value, label }));

export default function MyCoursesPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState({ open: false, id: null });
  const [refund, setRefund] = useState({ open: false, mode: "PAID", invoiceId: null });
  const [cancel, setCancel] = useState({ open: false, id: null });
  const [cancelling, setCancelling] = useState(false);

  const listRequest = useCallback(() => enrollmentApi.getMine({ page, limit: PAGE_SIZE, status: status || undefined }), [page, status]);
  const refundRequest = useCallback(() => invoiceApi.getMyRefundRequests({ limit: 100 }), []);
  const list = useFetch(listRequest);
  const refunds = useFetch(refundRequest);

  const pendingIds = useMemo(
    () => new Set((refunds.data?.items ?? []).filter((item) => PENDING_REFUND_STATUSES.includes(item.status)).map((item) => item.registrationId)),
    [refunds.data],
  );

  const refresh = () => {
    list.reload();
    refunds.reload();
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await enrollmentApi.cancel(cancel.id);
      toast.success(res.message);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
      setCancel((prev) => ({ ...prev, open: false }));
    }
  };

  const handleFilter = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Khóa học của tôi</h1>
        <select aria-label="Lọc theo trạng thái" value={status} onChange={handleFilter} className={`${inputClass()} w-48`}>
          <option value="">Tất cả trạng thái</option>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {list.loading && <LoadingState />}
      {list.error && <ErrorState message={list.error} onRetry={list.reload} />}
      {list.data && list.data.items.length === 0 && <EmptyState message="Bạn chưa có đăng ký khóa học nào" />}
      {list.data && list.data.items.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.data.items.map((registration) => (
              <MyCourseCard
                key={registration.id}
                registration={registration}
                pendingRefund={pendingIds.has(registration.id)}
                onOpenPayment={(id) => setPayment({ open: true, id })}
                onCancel={(id) => setCancel({ open: true, id })}
                onRefund={(invoiceId, mode) => setRefund({ open: true, mode, invoiceId })}
              />
            ))}
          </div>
          <Pagination pagination={list.data.pagination} onChange={setPage} />
        </>
      )}
      <PaymentModal open={payment.open} registrationId={payment.id} onClose={() => setPayment((prev) => ({ ...prev, open: false }))} onChanged={refresh} />
      <RefundRequestModal
        open={refund.open}
        mode={refund.mode}
        invoiceId={refund.invoiceId}
        onClose={() => setRefund((prev) => ({ ...prev, open: false }))}
        onDone={() => {
          setRefund((prev) => ({ ...prev, open: false }));
          refresh();
        }}
      />
      <ConfirmDialog
        open={cancel.open}
        title="Hủy đăng ký khóa học?"
        message="Đơn đăng ký sẽ bị hủy. Bạn có thể đăng ký lại khóa học này sau."
        confirmLabel="Hủy đăng ký"
        cancelLabel="Giữ lại"
        danger
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancel((prev) => ({ ...prev, open: false }))}
      />
    </section>
  );
}
