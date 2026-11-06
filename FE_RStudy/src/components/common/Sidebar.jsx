import { LogIn, Package, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { SITE_INFO } from "../../constants/siteInfo";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../ui/Avatar";
import { NAV_ITEMS } from "./navItems";
import { SOCIAL_ICONS } from "./socialIcons";

const linkClass = ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-surface text-primary" : "text-ink hover:bg-surface"}`;

export default function Sidebar() {
  const { account } = useAuth();
  const accountLinks = [{ label: "Thông tin cá nhân", to: ROUTES.PROFILE, icon: User }];
  if (account?.role === ROLES.STUDENT) {
    accountLinks.push({ label: "Kho vật phẩm", to: ROUTES.ITEMS, icon: Package });
  }
  const menuLinks = NAV_ITEMS.filter((item) => item.to !== ROUTES.HOME);

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-4 overflow-y-auto">
        {account ? (
          <>
            <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-card">
              <Avatar name={account.fullName} src={account.avatarUrl} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{account.fullName}</p>
                <p className="truncate text-xs text-muted">{account.email}</p>
              </div>
            </div>
            <nav aria-label="Tài khoản" className="space-y-1">
              {accountLinks.map(({ label, to, icon: Icon }) => (
                <NavLink key={to} to={to} end className={linkClass}>
                  <Icon size={20} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </>
        ) : (
          <NavLink to={ROUTES.LOGIN} className={linkClass}>
            <LogIn size={20} />
            Đăng nhập
          </NavLink>
        )}
        <nav aria-label="Danh mục" className="space-y-1 border-t border-line pt-4">
          {menuLinks.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line pt-4">
          <p className="mb-2 px-3 text-xs font-semibold tracking-wide text-muted uppercase">Liên kết</p>
          <ul className="space-y-1">
            {SITE_INFO.socials.map(({ label, href }) => {
              const Icon = SOCIAL_ICONS[label];
              return (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-surface">
                    <Icon size={20} />
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
