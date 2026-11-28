import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import FilterPanel from "../../components/common/FilterPanel";
import FilterRadioList from "../../components/common/FilterRadioList";
import FilterSection from "../../components/common/FilterSection";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import PriceRangeSlider from "./PriceRangeSlider";

const PRICE_LIMIT = 5_000_000;
const PRICE_STEP = 100_000;
const PRICE_PRESETS = [
  { label: "Miễn phí", range: [0, 0] },
  { label: "Dưới 1,5 triệu", range: [0, 1_500_000] },
  { label: "1,5 - 3 triệu", range: [1_500_000, 3_000_000] },
  { label: "Trên 3 triệu", range: [3_000_000, PRICE_LIMIT] },
];
const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "start_soon", label: "Sắp khai giảng" },
  { value: "name", label: "Tên A đến Z" },
];

const shortPrice = (value) => {
  if (value === 0) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} triệu`;
  return `${value / 1000} nghìn`;
};
const priceLabel = (value) => (value >= PRICE_LIMIT ? `${shortPrice(PRICE_LIMIT)}+` : shortPrice(value));

// Đầu phải kéo hết cỡ nghĩa là không giới hạn trên (không gửi maxPrice)
const toRange = ({ minPrice, maxPrice }) => [Math.min(Number(minPrice) || 0, PRICE_LIMIT), maxPrice === "" ? PRICE_LIMIT : Math.min(Number(maxPrice), PRICE_LIMIT)];
const toParams = ([min, max]) => ({ minPrice: min > 0 ? String(min) : "", maxPrice: max < PRICE_LIMIT ? String(max) : "" });
const sameRange = (a, b) => a[0] === b[0] && a[1] === b[1];

const inputClass =
  "h-11 w-full rounded-lg border border-line bg-white pr-3 pl-9 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted hover:border-line-strong focus:border-primary focus:ring-2 focus:ring-primary-light/40";
const chipClass = "min-h-9 rounded-lg border px-2.5 text-xs font-medium transition-colors duration-150";

export default function CourseFilterSidebar({ values, categories = [], onChange, onReset }) {
  const urlRange = toRange(values);
  const [keyword, setKeyword] = useState(values.q);
  const [range, setRange] = useState(urlRange);
  const [syncedQ, setSyncedQ] = useState(values.q);
  const [syncedRange, setSyncedRange] = useState(urlRange);

  // URL đổi từ nơi khác (ô tìm kiếm trên header, nút Đặt lại) thì cập nhật ô nhập và thanh kéo theo
  if (values.q !== syncedQ) {
    setSyncedQ(values.q);
    setKeyword(values.q);
  }
  if (!sameRange(urlRange, syncedRange)) {
    setSyncedRange(urlRange);
    setRange(urlRange);
  }

  const debouncedKeyword = useDebouncedValue(keyword, 400);
  const debouncedRange = useDebouncedValue(range, 300);

  // Chỉ ghi lên URL khi người dùng đã ngừng gõ/kéo (giá trị trễ đã bắt kịp giá trị hiện tại), tránh ghi đè thay đổi từ nơi khác
  useEffect(() => {
    if (debouncedKeyword === keyword && debouncedKeyword.trim() !== values.q) onChange({ q: debouncedKeyword.trim() });
  }, [debouncedKeyword, keyword, values.q, onChange]);

  useEffect(() => {
    if (sameRange(debouncedRange, range) && !sameRange(debouncedRange, toRange(values))) onChange(toParams(debouncedRange));
  }, [debouncedRange, range, values, onChange]);

  const categoryOptions = [{ value: "", label: "Tất cả" }, ...categories.map((c) => ({ value: c.id, label: c.categoryName, count: c.courseCount }))];
  const filtered = Boolean(values.q || values.categoryId || values.minPrice || values.maxPrice || values.sort !== "newest");

  return (
    <FilterPanel onReset={onReset} canReset={filtered}>
      <FilterSection title="Tìm kiếm">
        <div className="relative">
          <Search size={16} aria-hidden="true" className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={keyword}
            maxLength={100}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tên khóa học, danh mục, giáo viên"
            aria-label="Tìm khóa học"
            className={inputClass}
          />
        </div>
      </FilterSection>
      <FilterSection title="Danh mục">
        <FilterRadioList name="course-category" options={categoryOptions} value={values.categoryId} onChange={(categoryId) => onChange({ categoryId })} scroll />
      </FilterSection>
      <FilterSection title="Học phí" aside={`${shortPrice(range[0])} - ${priceLabel(range[1])}`}>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const active = sameRange(range, preset.range);
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() => setRange(preset.range)}
                className={`${chipClass} ${active ? "border-primary bg-primary text-white" : "border-line bg-surface text-ink hover:bg-primary-50"}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <PriceRangeSlider min={range[0]} max={range[1]} limit={PRICE_LIMIT} step={PRICE_STEP} onChange={setRange} formatValue={priceLabel} />
        <div className="grid grid-cols-2 gap-2 text-xs">
          <p className="rounded-lg border border-line bg-surface px-3 py-2 text-muted">
            Tối thiểu <span className="block font-semibold text-ink">{shortPrice(range[0])}</span>
          </p>
          <p className="rounded-lg border border-line bg-surface px-3 py-2 text-muted">
            Tối đa <span className="block font-semibold text-ink">{priceLabel(range[1])}</span>
          </p>
        </div>
      </FilterSection>
      <FilterSection title="Sắp xếp">
        <FilterRadioList name="course-sort" options={SORT_OPTIONS} value={values.sort} onChange={(sort) => onChange({ sort: sort === "newest" ? "" : sort })} />
      </FilterSection>
    </FilterPanel>
  );
}
