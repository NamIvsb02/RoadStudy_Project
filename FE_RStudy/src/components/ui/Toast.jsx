import { motion } from "framer-motion";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { slideInRight } from "../../constants/motion";

const TYPES = {
  success: { icon: CircleCheck, color: "text-success" },
  error: { icon: CircleX, color: "text-danger" },
  warning: { icon: TriangleAlert, color: "text-warning" },
  info: { icon: Info, color: "text-info" },
};

export default function Toast({ toast, onClose }) {
  const { icon: Icon, color } = TYPES[toast.type];

  return (
    <motion.div variants={slideInRight} initial="hidden" animate="visible" exit="exit" role="status" className="flex items-start gap-3 rounded-xl border border-line bg-white p-3 shadow-card-hover">
      <Icon size={20} className={`mt-0.5 shrink-0 ${color}`} />
      <p className="flex-1 text-sm text-ink">{toast.message}</p>
      <button type="button" onClick={onClose} aria-label="Đóng thông báo" className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:text-ink">
        <X size={16} />
      </button>
    </motion.div>
  );
}
