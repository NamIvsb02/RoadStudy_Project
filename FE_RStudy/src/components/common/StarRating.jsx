import { Star } from 'lucide-react';

const STARS = [1, 2, 3, 4, 5];

export default function StarRating({ value = 0, size = 16, onChange }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {STARS.map((n) => {
        const filled = n <= Math.round(value);
        const icon = (
          <Star
            size={size}
            className={filled ? 'text-accent' : 'text-slate-300'}
            fill={filled ? 'currentColor' : 'none'}
          />
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            aria-label={`${n} sao`}
            onClick={() => onChange(n)}
            className="transition-transform duration-150 hover:scale-110"
          >
            {icon}
          </button>
        ) : (
          <span key={n}>{icon}</span>
        );
      })}
    </span>
  );
}