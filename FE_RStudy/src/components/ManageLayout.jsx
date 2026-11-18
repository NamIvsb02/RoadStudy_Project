import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, LogOut, Menu, X } from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { fadeIn, slideInLeft } from "../constants/motion";
import { ROLES } from "../constants/roles";
import { ROUTES } from "../constants/routes";
import { ROLE_LABELS } from "../constants/statuses";
import { useAuth } from "../hooks/useAuth";
import { isLeader } from "../utils/permission";
import UserMenu from "./common/UserMenu";
import { getManageNav } from "./manage/manageNav";
import Avatar from "./ui/Avatar";

const APPROVAL_NOTICE = {
  CHO_DUYET: "Hồ sơ của bạn đang chờ quản trị viên duyệt. Trong lúc chờ, bạn chưa tạo được khóa học.",
  TU_CHOI: "Hồ sơ của bạn đã bị từ chối. Hãy cập nhật hồ sơ hoặc liên hệ quản trị viên.",
};

function SidebarContent({ items, onNavigate, onLogout }) {
  return (
    <>
      <div className="px-6 py-5 text-xl font-bold text-white">RoadStudy</div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {items.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive ? "bg-white font-semibold text-primary" : "text-white/85 hover:bg-white/10"}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="flex flex-col gap-1 border-t border-white/15 p-3">
        <Link to={ROUTES.HOME} onClick={onNavigate} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/10">
          <Home size={18} />
          Về trang chủ
        </Link>
        <button type="button" onClick={onLogout} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/10 lg:hidden">
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </>
  );
}

export default function ManageLayout() {
  const { account, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const items = getManageNav(account);
  const current = items.find(({ to, end }) => (end ? pathname === to : pathname.startsWith(to)));
  const roleLabel = isLeader(account) ? "Quản trị viên trưởng" : ROLE_LABELS[account.role];
  const notice = account.role === ROLES.TEACHER ? APPROVAL_NOTICE[account.teacher?.approvalStatus] : null;

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-primary lg:flex">
        <SidebarContent items={items} onLogout={handleLogout} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Mở menu" onClick={() => setOpen(true)} className="rounded-lg p-2 text-ink transition-colors hover:bg-surface lg:hidden">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-ink">{current?.label ?? "Quản lý"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">
              {account.fullName} · {roleLabel}
            </span>
            <UserMenu />
            <Avatar name={account.fullName} src={account.avatarUrl} size="sm" className="lg:hidden" />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {notice && <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{notice}</div>}
          <Outlet />
        </main>
      </div>

      <AnimatePresence>
        {open && <motion.div key="overlay" variants={fadeIn} initial="hidden" animate="visible" exit="exit" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}
        {open && (
          <motion.aside key="drawer" variants={slideInLeft} initial="hidden" animate="visible" exit="exit" className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-primary lg:hidden">
            <button type="button" aria-label="Đóng menu" onClick={() => setOpen(false)} className="absolute top-4 right-3 rounded-lg p-1 text-white/85 hover:bg-white/10">
              <X size={20} />
            </button>
            <SidebarContent items={items} onNavigate={() => setOpen(false)} onLogout={handleLogout} />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
