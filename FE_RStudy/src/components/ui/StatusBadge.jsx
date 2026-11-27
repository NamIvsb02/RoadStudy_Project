import { STATUS_MAPS } from "../../constants/statuses";

const TONES = {
  gray: { badge: "bg-muted/10 text-muted", dot: "bg-muted" },
  yellow: { badge: "bg-warning/10 text-warning-strong", dot: "bg-warning" },
  green: { badge: "bg-success/10 text-success-strong", dot: "bg-success" },
  red: { badge: "bg-danger/10 text-danger-strong", dot: "bg-danger" },
  blue: { badge: "bg-info/10 text-info-strong", dot: "bg-info" },
};

export default function StatusBadge({ type, value, className = "" }) {
  if (!value) return null;
  const entry = STATUS_MAPS[type]?.[value];
  const tone = TONES[entry?.tone ?? "gray"];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${tone.badge} ${className}`}>
      <span className={`size-1.5 shrink-0 rounded-full ${tone.dot}`} aria-hidden="true" />
      {entry?.label ?? value}
    </span>
  );
}
