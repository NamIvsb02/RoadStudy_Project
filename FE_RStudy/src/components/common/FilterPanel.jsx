import { useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

// Khung bộ lọc ở cột trái: desktop luôn mở và dính khi cuộn; mobile thu gọn sau nút "Bộ lọc"
export default function FilterPanel({ onReset, canReset = true, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-line bg-white lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex min-h-11 items-center gap-2 text-base font-bold text-ink-strong lg:pointer-events-none lg:min-h-0"
        >
          <SlidersHorizontal size={16} aria-hidden="true" className="lg:hidden" />
          Bộ lọc
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={!canReset}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-primary-50 disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-transparent lg:min-h-9"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Đặt lại
        </button>
      </div>
      <div className={`divide-y divide-line border-t border-line px-4 ${open ? "block" : "hidden"} lg:block`}>{children}</div>
    </div>
  );
}
