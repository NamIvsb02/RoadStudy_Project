import { Link } from 'react-router-dom';

export default function SectionHeader({ title, actionLabel = 'Xem tất cả', actionTo }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="border-l-4 border-primary pl-3 text-xl font-bold text-slate-800">{title}</h2>
      {actionTo && (
        <Link to={actionTo} className="text-sm font-medium text-primary hover:underline">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}