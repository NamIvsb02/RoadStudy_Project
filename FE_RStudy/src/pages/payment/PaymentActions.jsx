import { useState } from "react";
import { enrollmentApi } from "../../api/enrollmentApi";
import { invoiceApi } from "../../api/invoiceApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import NoteDialog from "../../components/common/NoteDialog";
import Button from "../../components/ui/Button";
import FormAlert from "../../components/ui/FormAlert";
import { canRefundPaid } from "./paymentState";

export default function PaymentActions({ registration, stage, onChanged }) {
  const [dialog, setDialog] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const free = Number(registration.invoice?.totalAmount ?? 0) === 0;
  const canCancel = stage === "AWAITING" || stage === "REJECTED";
  const canRefund = !free && (stage === "REVIEWING" || (stage === "PAID" && canRefundPaid(registration.invoice)));

  if (!canCancel && !canRefund) return null;

  const handleCancel = async () => {
    setDialog("");
    setBusy(true);
    setError("");
    try {
      await enrollmentApi.cancel(registration.id);
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRefund = async (description) => {
    await invoiceApi.requestRefund(registration.invoice.id, description);
    setDialog("");
    setSent(true);
  };

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <FormAlert message={error} />
      {sent && <p className="mb-3 rounded-lg bg-success/10 px-3 py-2 text-sm text-success-strong">Đã gửi yêu cầu hoàn tiền. Quản trị viên sẽ xem xét và thông báo cho bạn.</p>}
      <div className="flex flex-wrap items-center gap-3">
        {canCancel && (
          <Button variant="secondary" loading={busy} onClick={() => setDialog("cancel")}>
            Hủy đăng ký
          </Button>
        )}
        {canRefund && (
          <Button variant="secondary" onClick={() => setDialog("refund")}>
            {stage === "PAID" ? "Yêu cầu hoàn tiền" : "Hủy và yêu cầu hoàn tiền"}
          </Button>
        )}
        {stage === "PAID" && <span className="text-xs text-muted">Chỉ hoàn tiền được trong vòng 24 giờ kể từ lúc thanh toán.</span>}
      </div>
      <ConfirmDialog
        open={dialog === "cancel"}
        title="Hủy đăng ký?"
        message="Đơn đăng ký và hóa đơn sẽ bị hủy, mã giảm giá (nếu có) được trả lại."
        confirmLabel="Hủy đăng ký"
        danger
        onConfirm={handleCancel}
        onCancel={() => setDialog("")}
      />
      <NoteDialog open={dialog === "refund"} title="Yêu cầu hoàn tiền" label="Lý do" confirmLabel="Gửi yêu cầu" onSubmit={handleRefund} onCancel={() => setDialog("")} />
    </section>
  );
}
