import { motion } from "framer-motion";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { slideInRight } from "../../constants/motion";

const TYPES = {
  success: { icon: CircleCheck, color: "text-success", bar: "bg-success" },
  error: { icon: CircleX, color: "text-danger", bar: "bg-danger" },
  warning: { icon: TriangleAlert, color: "text-warning", bar: "bg-warning" },
  info: { icon: Info, color: "text-info", bar: "bg-info" },
};

export default function Toast({ toast, onClose }) {
  const { icon: Icon, color, bar } = TYPES[toast.type];

  return (
    <motion.div
      layout
      variants={slideInRight}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="status"
      className="relative flex items-start gap-3 overflow-hidden rounded-xl border border-line bg-white p-3 pl-4 shadow-card-hover"
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} aria-hidden="true" />
      <Icon size={20} className={`mt-0.5 shrink-0 ${color}`} />
      <p className="flex-1 text-sm text-ink">{toast.message}</p>
      <button type="button" onClick={onClose} aria-label="Đóng thông báo" className="-my-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:text-ink">
        <X size={16} />
      </button>
    </motion.div>
  );
}
