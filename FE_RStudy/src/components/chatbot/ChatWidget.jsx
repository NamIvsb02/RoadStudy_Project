import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import ChatPanel from "./ChatPanel";

function GuestPrompt({ onClose }) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 text-center shadow-card-hover">
      <p className="text-base font-semibold text-ink">Trợ lý RoadStudy</p>
      <p className="text-sm text-muted">Đăng nhập tài khoản học viên để chat với trợ lý AI và nhận gợi ý khóa học phù hợp.</p>
      <Link
        to={ROUTES.LOGIN}
        state={{ from: location }}
        onClick={onClose}
        className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Đăng nhập
      </Link>
    </div>
  );
}

export default function ChatWidget() {
  const { account } = useAuth();
  const [open, setOpen] = useState(false);

  if (account && account.role !== ROLES.STUDENT) return null;

  return (
    <>
      <div className={`fixed right-4 bottom-36 z-50 h-[70vh] max-h-[620px] w-[calc(100vw-2rem)] max-w-96 lg:right-6 lg:bottom-24 ${open ? "" : "hidden"}`}>
        {account ? <ChatPanel key={account.id} onClose={() => setOpen(false)} /> : open && <GuestPrompt onClose={() => setOpen(false)} />}
      </div>
      <button
        type="button"
        aria-label={open ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="fixed right-4 bottom-20 z-50 inline-flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-card-hover transition-colors hover:bg-primary-dark lg:right-6 lg:bottom-6"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
