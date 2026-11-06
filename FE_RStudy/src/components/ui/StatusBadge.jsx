import { STATUS_MAPS } from "../../constants/statuses";

const TONES = {
  gray: "bg-muted/10 text-muted",
  yellow: "bg-warning/10 text-warning",
  green: "bg-success/10 text-success",
  red: "bg-danger/10 text-danger",
  blue: "bg-info/10 text-info",
};

export default function StatusBadge({ type, value, className = "" }) {
  if (!value) return null;
  const entry = STATUS_MAPS[type]?.[value];
  const tone = TONES[entry?.tone ?? "gray"];

  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${tone} ${className}`}>{entry?.label ?? value}</span>;
}
