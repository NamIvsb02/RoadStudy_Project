import StarRating from '../../components/common/StarRating';

const FILTERS = [0, 5, 4, 3, 2, 1];

export default function ReviewSummary({ summary, rating, onFilter }) {
  const { averageRating, reviewCount } = summary;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-6">
      <div className="text-center">
        <p className="text-4xl font-bold text-primary">{averageRating ?? '-'}</p>
        <StarRating value={averageRating ?? 0} size={20} />
        <p className="text-sm text-slate-500">{reviewCount} đánh giá</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onFilter(value)}
            className={`rounded-full px-3 py-1 text-sm transition-colors duration-150 ${
              rating === value ? 'bg-primary text-white' : 'bg-soft text-slate-700 hover:bg-slate-200'
            }`}
          >
            {value === 0 ? 'Tất cả' : `${value} sao`}
          </button>
        ))}
      </div>
    </div>
  );
}