import { motion } from "framer-motion";
import { tabIndicator } from "../../constants/motion";

export default function Switch({ checked, disabled = false, label, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors duration-150 disabled:opacity-50 ${checked ? "justify-end bg-primary" : "justify-start bg-line-strong"}`}
    >
      <motion.span layout transition={tabIndicator} className="size-5 rounded-full bg-white shadow-card" />
    </button>
  );
}
