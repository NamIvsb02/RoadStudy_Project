import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SectionHeader({ title, eyebrow, description, actionLabel = "Xem tất cả", actionTo }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs font-semibold tracking-wider text-primary uppercase">{eyebrow}</p>}
        <h2 className="border-l-4 border-primary pl-3 text-xl font-bold text-ink-strong">{title}</h2>
        {description && <p className="mt-1 pl-4 text-sm text-muted">{description}</p>}
      </div>
      {actionTo && (
        <Link
          to={actionTo}
          className="group relative inline-flex shrink-0 items-center gap-1 pb-0.5 text-sm font-medium text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:after:scale-x-100"
        >
          {actionLabel}
          <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
