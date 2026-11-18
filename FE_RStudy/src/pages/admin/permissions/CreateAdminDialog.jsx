import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn, scaleIn } from "../../../constants/motion";
import CreateAdminForm from "./CreateAdminForm";

export default function CreateAdminDialog({ open, onClose, onCreated }) {
  const titleId = useId();

  return (
    <AnimatePresence>
      {open && (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-50 flex overflow-y-auto bg-black/40 p-4">
          <motion.div variants={scaleIn} role="dialog" aria-modal="true" aria-labelledby={titleId} className="m-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-card-hover">
            <h2 id={titleId} className="text-lg font-semibold text-ink">
              Thêm quản trị viên
            </h2>
            <p className="mt-1 text-sm text-muted">Tài khoản đăng nhập được ngay. Quyền sẽ gán sau ở bảng phân quyền.</p>
            <CreateAdminForm onClose={onClose} onCreated={onCreated} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
