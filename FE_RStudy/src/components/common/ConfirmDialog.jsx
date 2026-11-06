import { useEffect, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import { fadeIn, scaleIn } from "../../constants/motion";
import Button from "../ui/Button";

export default function ConfirmDialog({ open, title, message, confirmLabel = "Xác nhận", cancelLabel = "Hủy", danger = false, loading = false, onConfirm, onCancel }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, loading, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseDown={() => !loading && onCancel()}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            variants={scaleIn}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-hover"
          >
            <div className="flex items-start gap-4">
              {danger && (
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
                  <TriangleAlert size={24} />
                </span>
              )}
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-ink">
                  {title}
                </h2>
                {message && <p className="mt-1 text-sm text-muted">{message}</p>}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={onCancel} disabled={loading} autoFocus>
                {cancelLabel}
              </Button>
              <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
