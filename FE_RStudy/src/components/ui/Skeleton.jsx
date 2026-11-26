export default function Skeleton({ className = "" }) {
  return <div aria-hidden="true" className={`rounded-lg bg-surface ${className}`} />;
}
