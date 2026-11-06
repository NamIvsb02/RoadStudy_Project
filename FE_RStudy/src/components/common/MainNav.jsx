import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { NAV_ITEMS } from "./navItems";

export default function MainNav() {
  return (
    <nav aria-label="Điều hướng chính" className="hidden flex-1 justify-center gap-2 lg:flex">
      {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === ROUTES.HOME}
          title={label}
          aria-label={label}
          className={({ isActive }) =>
            `inline-flex h-10 w-16 items-center justify-center rounded-lg transition-colors ${isActive ? "bg-surface text-primary" : "text-muted hover:bg-surface hover:text-primary"}`
          }
        >
          <Icon size={20} />
        </NavLink>
      ))}
    </nav>
  );
}
