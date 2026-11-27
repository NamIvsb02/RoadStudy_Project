import { motion } from 'framer-motion';
import StarRating from '../../components/common/StarRating';
import { EASE, VIEWPORT } from '../../constants/motion';

const FILTERS = [0, 5, 4, 3, 2, 1];

export default function ReviewSummary({ summary, rating, onFilter }) {
  const { averageRating, reviewCount } = summary;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-6">
      <div className="min-w-32 text-center">
        <p className="text-4xl font-bold text-primary">{averageRating ?? '-'}</p>
        <StarRating value={averageRating ?? 0} size={20} />
        <p className="text-sm text-muted">{reviewCount} đánh giá</p>
        <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: (averageRating ?? 0) / 5 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE.out }}
            className="h-full origin-left rounded-full bg-accent"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onFilter(value)}
            aria-pressed={rating === value}
            className={`min-h-11 rounded-full px-4 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light ${
              rating === value ? 'bg-primary text-white' : 'bg-surface text-ink hover:bg-primary-100'
            }`}
          >
            {value === 0 ? 'Tất cả' : `${value} sao`}
          </button>
        ))}
      </div>
    </div>
  );
}
