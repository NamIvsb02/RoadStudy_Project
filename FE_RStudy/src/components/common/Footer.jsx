import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { SITE_INFO } from "../../constants/siteInfo";
import { useAuth } from "../../hooks/useAuth";
import { NAV_ITEMS } from "./navItems";
import { SOCIAL_ICONS } from "./socialIcons";

const linkClass = "text-sm text-white/80 transition-colors hover:text-white";
const headingClass = "mb-3 text-sm font-semibold tracking-wide uppercase";

export default function Footer() {
  const { account } = useAuth();
  const accountLinks = account
    ? [{ label: "Hồ sơ", to: ROUTES.PROFILE }]
    : [
        { label: "Đăng nhập", to: ROUTES.LOGIN },
        { label: "Đăng ký", to: ROUTES.REGISTER },
      ];

  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <h2 className="mb-3 text-lg font-bold">{SITE_INFO.name}</h2>
          <p className="mb-4 text-sm text-white/80">{SITE_INFO.description}</p>
          <ul className="flex gap-2">
            {SITE_INFO.socials.map(({ label, href }) => {
              const Icon = SOCIAL_ICONS[label];
              return (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <nav aria-label="Khám phá">
          <h3 className={headingClass}>Khám phá</h3>
          <ul className="space-y-2">
            {NAV_ITEMS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Tài khoản">
          <h3 className={headingClass}>Tài khoản</h3>
          <ul className="space-y-2">
            {accountLinks.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h3 className={headingClass}>Liên hệ</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              {SITE_INFO.address}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              {SITE_INFO.email}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              {SITE_INFO.phone}
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/70">
        © {new Date().getFullYear()} {SITE_INFO.name}
      </p>
    </footer>
  );
}
