import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { tabIndicator } from "../../constants/motion";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { getNavItems } from "./navItems";

export default function MainNav({ className = "" }) {
  const { account } = useAuth();

  return (
    <nav aria-label="Điều hướng chính" className={`hidden flex-1 justify-center gap-1 lg:flex ${className}`}>
      {getNavItems(account).map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === ROUTES.HOME}
          title={label}
          aria-label={label}
          className={({ isActive }) =>
            `relative inline-flex h-10 min-w-12 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors duration-150 ${isActive ? "text-primary" : "text-muted hover:bg-surface hover:text-primary"}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <motion.span layoutId="main-nav" transition={tabIndicator} className="absolute inset-0 rounded-lg bg-primary-50" />}
              <Icon size={20} className="relative" />
              <span className="relative hidden xl:inline">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
