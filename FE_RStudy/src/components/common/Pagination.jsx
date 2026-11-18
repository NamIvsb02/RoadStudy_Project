import { ChevronLeft, ChevronRight } from "lucide-react";

const getPages = (page, totalPages) => {
  const sorted = [...new Set([1, totalPages, page - 1, page, page + 1])]
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);
  const result = [];
  sorted.forEach((item, index) => {
    if (index > 0 && item - sorted[index - 1] > 1) result.push(`gap-${item}`);
    result.push(item);
  });
  return result;
};

const baseClass =
  "inline-flex size-9 items-center justify-center rounded-lg text-sm transition-colors";
const arrowClass = `${baseClass} text-ink hover:bg-primary/10 disabled:opacity-40 disabled:hover:bg-transparent`;

export default function Pagination({ pagination, onChange }) {
  const { page, totalPages, total } = pagination ?? {};
  if (!totalPages || totalPages <= 1) return null;

  return (
    <nav
      aria-label="Phân trang"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-sm text-muted">Tổng {total} kết quả</p>
      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            aria-label="Trang trước"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            className={arrowClass}
          >
            <ChevronLeft size={16} />
          </button>
        </li>
        {getPages(page, totalPages).map((item) =>
          typeof item === "string" ? (
            <li key={item} className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-current={item === page ? "page" : undefined}
                onClick={() => onChange(item)}
                className={`${baseClass} ${item === page ? "bg-primary font-semibold text-white" : "text-ink hover:bg-primary/10"}`}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            aria-label="Trang sau"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            className={arrowClass}
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
