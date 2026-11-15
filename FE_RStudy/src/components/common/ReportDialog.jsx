import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn, scaleIn } from "../../constants/motion";
import Button from "../ui/Button";
import ReportForm from "./ReportForm";

export default function ReportDialog({ open, sent, target, onClose, onSent }) {
  const titleId = useId();

  return (
    <AnimatePresence>
      {open && (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-50 flex overflow-y-auto bg-black/40 p-4">
          <motion.div variants={scaleIn} role="dialog" aria-modal="true" aria-labelledby={titleId} className="m-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-card-hover">
            <h2 id={titleId} className="text-lg font-semibold text-ink">
              Báo cáo vi phạm
            </h2>
            {sent ? (
              <>
                <p className="mt-3 text-sm text-muted">Đã gửi báo cáo. Quản trị viên sẽ xem xét, cảm ơn bạn.</p>
                <div className="mt-5 flex justify-end">
                  <Button onClick={onClose} autoFocus>
                    Đóng
                  </Button>
                </div>
              </>
            ) : (
              <ReportForm target={target} onClose={onClose} onSent={onSent} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
