import { motion } from "framer-motion";
import { BookMarked, ChevronRight, IdCard, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge";
import { tabIndicator } from "../../constants/motion";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { ROLE_LABELS } from "../../constants/statuses";
import { useAuth } from "../../hooks/useAuth";
import AvatarUploader from "./AvatarUploader";

const VIEW_ITEMS = [
  { view: "info", label: "Thông tin cá nhân", icon: IdCard },
  { view: "password", label: "Đổi mật khẩu", icon: KeyRound },
];

const itemClass = "relative flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150";

function ItemContent({ icon: Icon, label, active }) {
  return (
    <>
      {active && <motion.span layoutId="profile-nav" transition={tabIndicator} className="absolute inset-0 rounded-lg bg-primary" />}
      <Icon size={20} aria-hidden="true" className="relative shrink-0" />
      <span className="relative flex-1 text-left">{label}</span>
      <ChevronRight size={16} aria-hidden="true" className="relative shrink-0" />
    </>
  );
}

export default function ProfileSidebar({ activeView, onSelect }) {
  const { account } = useAuth();

  return (
    <aside className="rounded-xl border border-line bg-white p-5 sm:p-6">
      <AvatarUploader />
      <div className="mt-2 text-center">
        <p className="truncate text-lg font-semibold text-ink-strong">{account.fullName}</p>
        <p className="truncate text-sm text-muted">{account.email}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary">{ROLE_LABELS[account.role]}</span>
          {account.role === ROLES.TEACHER && <StatusBadge type="ApprovalStatus" value={account.teacher?.approvalStatus} />}
        </div>
      </div>
      <nav aria-label="Trang cá nhân" className="mt-5 space-y-1 border-t border-line pt-5">
        {VIEW_ITEMS.map(({ view, label, icon }) => {
          const active = activeView === view;
          return (
            <button
              key={view}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => onSelect(view)}
              className={`${itemClass} ${active ? "text-white" : "text-ink hover:bg-primary-50"}`}
            >
              <ItemContent icon={icon} label={label} active={active} />
            </button>
          );
        })}
        {account.role === ROLES.STUDENT && (
          <Link to={ROUTES.MY_COURSES} className={`${itemClass} text-ink hover:bg-primary-50`}>
            <ItemContent icon={BookMarked} label="Khóa học của tôi" active={false} />
          </Link>
        )}
      </nav>
    </aside>
  );
}
