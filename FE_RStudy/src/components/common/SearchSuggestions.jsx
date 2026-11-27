import { Search } from "lucide-react";
import { formatVND } from "../../utils/format";
import CourseCover from "./CourseCover";

const keepFocus = (event) => event.preventDefault();

function StatusRow({ children }) {
  return (
    <p role="status" className="px-4 py-3 text-sm text-muted">
      {children}
    </p>
  );
}

export default function SearchSuggestions({ listId, optionId, items, activeIndex, status, error, keyword, onSelect, onHover, onShowAll }) {
  return (
    <div onMouseDown={keepFocus}>
      {status === "loading" && <StatusRow>Đang tìm khóa học...</StatusRow>}
      {status === "error" && <StatusRow>{error}</StatusRow>}
      {status === "empty" && <StatusRow>Không tìm thấy khóa học phù hợp.</StatusRow>}
      {items.length > 0 && (
        <ul id={listId} role="listbox" aria-label="Gợi ý khóa học" className="max-h-80 overflow-y-auto py-1">
          {items.map((course, index) => {
            const active = index === activeIndex;
            const price = Number(course.price) === 0 ? "Miễn phí" : formatVND(course.price);
            return (
              <li
                key={course.id}
                id={optionId(index)}
                role="option"
                aria-selected={active}
                onClick={() => onSelect(course)}
                onMouseEnter={() => onHover(index)}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors duration-150 ${active ? "bg-primary-50" : ""}`}
              >
                <span className="w-14 shrink-0">
                  <CourseCover src={course.coverImageUrl} className="rounded-md" />
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-1 block text-sm font-medium text-ink-strong">{course.courseName}</span>
                  <span className="block truncate text-xs text-muted">{[course.category?.categoryName, price].filter(Boolean).join(" · ")}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <button
        type="button"
        onClick={onShowAll}
        className="flex min-h-11 w-full items-center gap-2 border-t border-line px-4 text-left text-sm font-semibold text-primary transition-colors duration-150 hover:bg-primary-50"
      >
        <Search size={16} aria-hidden="true" />
        <span className="truncate">Xem tất cả kết quả cho “{keyword}”</span>
      </button>
    </div>
  );
}
