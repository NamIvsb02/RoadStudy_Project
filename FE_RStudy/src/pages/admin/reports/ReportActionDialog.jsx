import { AnimatePresence, motion } from "framer-motion";
import { fadeIn, scaleIn } from "../../../constants/motion";
import ReportActionForm from "./ReportActionForm";

export default function ReportActionDialog({ action, onSubmit, onCancel }) {
  return (
    <AnimatePresence>
      {action && (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-50 flex overflow-y-auto bg-black/40 p-4">
          <motion.div variants={scaleIn} role="dialog" aria-modal="true" aria-label={action.title} className="m-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-card-hover">
            <ReportActionForm title={action.title} label={action.label} confirmLabel={action.confirmLabel} danger={action.danger} onSubmit={onSubmit} onCancel={onCancel} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
