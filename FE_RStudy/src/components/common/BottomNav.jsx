import { LogIn, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { NAV_ITEMS } from "./navItems";

const itemClass = ({ isActive }) => `flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors ${isActive ? "text-accent" : "text-muted"}`;

export default function BottomNav() {
  const { account } = useAuth();
  const lastItem = account ? { label: "Cá nhân", to: ROUTES.PROFILE, icon: User } : { label: "Đăng nhập", to: ROUTES.LOGIN, icon: LogIn };
  const items = [...NAV_ITEMS, lastItem];

  return (
    <nav aria-label="Điều hướng dưới" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      {items.map(({ label, to, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === ROUTES.HOME} className={itemClass}>
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
