import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dropdown } from "../../constants/motion";
import { useAuth } from "../../hooks/useAuth";
import { useMarkRead, useNotificationList, useUnreadCount } from "../../hooks/useNotifications";
import LoadingState from "../ui/LoadingState";
import NotificationItem from "./NotificationItem";

const SHAKE = [0, -16, 14, -10, 6, 0];

export default function NotificationBell({ buttonClassName = "text-ink hover:bg-surface" }) {
  const { account } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const { data: unread = 0 } = useUnreadCount();
  const list = useNotificationList(open);
  const { markOne, markAll, markingAll } = useMarkRead();
  const [seen, setSeen] = useState(unread);
  const [shakeKey, setShakeKey] = useState(0);

  if (unread !== seen) {
    setSeen(unread);
    if (unread > seen) setShakeKey((key) => key + 1);
  }

  useEffect(() => {
    if (!open) return undefined;
    const handlePointer = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!account) return null;

  const items = list.data?.items ?? [];

  const handleSelect = (item) => {
    if (!item.isRead) markOne(item.id);
    setOpen(false);
    if (item.link) navigate(item.link);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={unread ? `Thông báo, ${unread} chưa đọc` : "Thông báo"}
        className={`relative inline-flex size-10 items-center justify-center rounded-full transition-colors ${buttonClassName}`}
      >
        <motion.span key={shakeKey} className="inline-flex origin-top" animate={shakeKey > 0 && !reduceMotion ? { rotate: SHAKE } : undefined} transition={{ duration: 0.5, ease: "easeOut" }}>
          <Bell size={20} />
        </motion.span>
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-semibold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdown}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label="Thông báo"
            className="absolute top-full right-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border border-line bg-white shadow-card-hover sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-sm font-semibold text-ink">Thông báo</p>
              <button type="button" disabled={unread === 0 || markingAll} onClick={() => markAll()} className="text-xs font-semibold text-primary hover:underline disabled:opacity-50">
                Đánh dấu tất cả đã đọc
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {list.isPending && <LoadingState />}
              {list.isError && <p className="px-4 py-6 text-center text-sm text-danger">{list.error.message}</p>}
              {list.isSuccess && items.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">Chưa có thông báo nào.</p>}
              <ul>
                {items.map((item) => (
                  <NotificationItem key={item.id} item={item} onSelect={handleSelect} />
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
