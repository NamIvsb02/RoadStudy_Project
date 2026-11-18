import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn, scaleIn } from "../../../constants/motion";
import CouponForm from "./CouponForm";

export default function CouponDialog({ dialog, onSubmit, onClose }) {
  const titleId = useId();

  return (
    <AnimatePresence>
      {dialog && (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-50 flex overflow-y-auto bg-black/40 p-4">
          <motion.div variants={scaleIn} role="dialog" aria-modal="true" aria-labelledby={titleId} className="m-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-card-hover">
            <h2 id={titleId} className="text-lg font-semibold text-ink">
              {dialog.coupon ? "Sửa mã giảm giá" : "Tạo mã giảm giá"}
            </h2>
            <CouponForm key={dialog.coupon?.id ?? "new"} coupon={dialog.coupon} onSubmit={onSubmit} onCancel={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
