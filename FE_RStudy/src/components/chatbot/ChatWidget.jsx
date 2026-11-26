import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { chatPanel } from "../../constants/motion";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import ChatPanel from "./ChatPanel";

function GuestPrompt({ onClose }) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-white p-6 text-center shadow-raised">
      <p className="text-base font-semibold text-ink-strong">Trợ lý RoadStudy</p>
      <p className="text-sm text-muted">Đăng nhập tài khoản học viên để chat với trợ lý AI và nhận gợi ý khóa học phù hợp.</p>
      <Link
        to={ROUTES.LOGIN}
        state={{ from: location }}
        onClick={onClose}
        className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Đăng nhập
      </Link>
    </div>
  );
}

export default function ChatWidget() {
  const { account } = useAuth();
  const [open, setOpen] = useState(false);
  const fabRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      fabRef.current?.focus();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  if (account && account.role !== ROLES.STUDENT) return null;

  const close = () => {
    setOpen(false);
    fabRef.current?.focus();
  };
  const iconMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, rotate: -90 }, animate: { opacity: 1, rotate: 0 }, exit: { opacity: 0, rotate: 90 } };

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        aria-label={open ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="fixed right-4 bottom-20 z-50 inline-flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-raised transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:right-6 lg:bottom-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? "close" : "open"} {...iconMotion} transition={{ duration: 0.16 }} className="inline-flex">
            {open ? <X size={24} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
      </button>
      <motion.div
        variants={chatPanel}
        initial={false}
        animate={open ? "visible" : "hidden"}
        inert={!open}
        style={{ transformOrigin: "bottom right" }}
        className="fixed right-4 bottom-36 z-50 h-[70vh] max-h-[min(620px,calc(100dvh-10rem))] w-[calc(100vw-2rem)] max-w-96 lg:right-6 lg:bottom-24"
      >
        {account ? <ChatPanel key={account.id} onClose={close} /> : open && <GuestPrompt onClose={() => setOpen(false)} />}
      </motion.div>
    </>
  );
}
