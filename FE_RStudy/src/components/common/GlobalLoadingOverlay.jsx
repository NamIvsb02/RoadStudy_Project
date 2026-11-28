import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn } from "../../constants/motion";
import SoftLogoCanvas from "./SoftLogoCanvas";

function OverlayContent({ message }) {
  const ref = useRef(null);

  // Giữ focus trong lớp phủ để bàn phím không thao tác được giao diện phía sau; đóng thì trả focus về chỗ cũ
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    return () => {
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, []);

  const blockKeys = (event) => {
    if (event.key === "Tab" || event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="status"
      aria-live="polite"
      aria-busy="true"
      tabIndex={-1}
      onKeyDown={blockKeys}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/38 outline-none"
    >
      <SoftLogoCanvas />
      {/* Không có nền riêng quanh chữ, nên dùng bóng chữ mỏng để vẫn đọc được khi chồng lên nội dung sáng phía sau */}
      <p className="-mt-2 px-4 text-center text-sm font-semibold text-primary-100 [text-shadow:0_1px_3px_var(--color-ink-strong)]">{message}</p>
    </motion.div>
  );
}

// Chỉ hiển thị, không biết nghiệp vụ: trạng thái mở và nội dung do nơi gọi truyền vào (thường qua LoadingProvider)
export default function GlobalLoadingOverlay({ open, message }) {
  return createPortal(<AnimatePresence>{open && <OverlayContent message={message} />}</AnimatePresence>, document.body);
}
