import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { dropdown } from "../../constants/motion";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../ui/Avatar";
import { GraduationCap } from "lucide-react";

const getMenuItems = (role) => {
  const items = [];
  if (role === ROLES.TEACHER) {
    items.push({
      label: "Trang giáo viên",
      to: ROUTES.TEACHER.ROOT,
      icon: LayoutDashboard,
    });
  }
  if (role === ROLES.ADMINISTRATOR) {
    items.push({
      label: "Trang quản trị",
      to: ROUTES.ADMIN.ROOT,
      icon: LayoutDashboard,
    });
  }
  items.push({ label: "Hồ sơ", to: ROUTES.PROFILE, icon: User });
  if (role === ROLES.STUDENT) {
    items.push({ label: "Kho vật phẩm", to: ROUTES.ITEMS, icon: Package });
    items.push({
      label: "Khóa học của tôi",
      to: ROUTES.STUDENT.MY_COURSES,
      icon: GraduationCap,
    });
  }
  return items;
};

const itemClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-surface";

export default function UserMenu() {
  const { account, logout } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <div ref={containerRef} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-surface"
      >
        <Avatar name={account.fullName} src={account.avatarUrl} size="sm" />
        <ChevronDown
          size={16}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdown}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="menu"
            className="absolute top-full right-0 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-white shadow-card-hover"
          >
            <div className="border-b border-line px-4 py-3">
              <p className="truncate text-sm font-semibold text-ink">
                {account.fullName}
              </p>
              <p className="truncate text-xs text-muted">{account.email}</p>
            </div>
            <ul className="p-1">
              {getMenuItems(account.role).map(({ label, to, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={itemClass}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className={`${itemClass} disabled:opacity-60`}
                >
                  {loggingOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  Đăng xuất
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
