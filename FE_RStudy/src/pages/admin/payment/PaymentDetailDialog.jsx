import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { invoiceApi } from "../../../api/invoiceApi";
import NoteDialog from "../../../components/common/NoteDialog";
import ProofImage from "../../../components/common/ProofImage";
import Button from "../../../components/ui/Button";
import FormAlert from "../../../components/ui/FormAlert";
import StatusBadge from "../../../components/ui/StatusBadge";
import { fadeIn, scaleIn } from "../../../constants/motion";
import { formatVND } from "../../../utils/format";

function Body({ invoice, onClose, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const reviewable = invoice.status === "CHO_THANH_TOAN" && invoice.hasPaymentProof;

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape" && !busy && !rejecting) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [busy, rejecting, onClose]);

  const handleApprove = async () => {
    setBusy(true);
    setError("");
    try {
      await invoiceApi.approve(invoice.id);
      onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const handleReject = async (reason) => {
    await invoiceApi.reject(invoice.id, reason);
    onDone();
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-ink">Chi tiết thanh toán</h2>
      <div className="mt-3 flex flex-col gap-1 text-sm">
        <p>
          <span className="text-muted">Học viên:</span> {invoice.student.account.fullName} ({invoice.student.account.email})
        </p>
        <p>
          <span className="text-muted">Khóa học:</span> {invoice.registration.course.courseName}
        </p>
        <p>
          <span className="text-muted">Số tiền:</span> <b>{formatVND(invoice.totalAmount)}</b>
        </p>
        <p className="flex items-center gap-2">
          <span className="text-muted">Trạng thái:</span> <StatusBadge type="InvoiceStatus" value={invoice.status} />
        </p>
        {invoice.rejectionReason && (
          <p>
            <span className="text-muted">Lý do từ chối:</span> {invoice.rejectionReason}
          </p>
        )}
      </div>
      <div className="mt-4">{invoice.hasPaymentProof ? <ProofImage invoiceId={invoice.id} /> : <p className="text-sm text-muted">Học viên chưa gửi minh chứng.</p>}</div>
      <div className="mt-3">
        <FormAlert message={error} />
      </div>
      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={busy}>
          Đóng
        </Button>
        {reviewable && (
          <>
            <Button variant="danger" disabled={busy} onClick={() => setRejecting(true)}>
              Từ chối
            </Button>
            <Button loading={busy} onClick={handleApprove}>
              Xác nhận thanh toán
            </Button>
          </>
        )}
      </div>
      <NoteDialog open={rejecting} title="Từ chối thanh toán" label="Lý do từ chối" confirmLabel="Từ chối" danger onSubmit={handleReject} onCancel={() => setRejecting(false)} />
    </>
  );
}

export default function PaymentDetailDialog({ invoice, onClose, onDone }) {
  return (
    <AnimatePresence>
      {invoice && (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-50 flex overflow-y-auto bg-black/40 p-4">
          <motion.div variants={scaleIn} role="dialog" aria-modal="true" aria-label="Chi tiết thanh toán" className="m-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-card-hover">
            <Body key={invoice.id} invoice={invoice} onClose={onClose} onDone={onDone} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
