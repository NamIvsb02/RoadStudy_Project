import { ChevronLeft, ChevronRight } from 'lucide-react';

const getPages = (page, totalPages) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }
  return pages;
};

const BASE = 'flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition-colors duration-150';

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <nav className="mt-6 flex items-center justify-center gap-1" aria-label="Phân trang">
      <button
        type="button"
        aria-label="Trang trước"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={`${BASE} bg-white text-slate-600 hover:bg-soft disabled:opacity-40`}
      >
        <ChevronLeft size={16} />
      </button>
      {getPages(page, totalPages).map((item, index) =>
        item === '...' ? (
          <span key={`gap-${index}`} className="px-1 text-slate-400">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`${BASE} ${item === page ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-soft'}`}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Trang sau"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={`${BASE} bg-white text-slate-600 hover:bg-soft disabled:opacity-40`}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}