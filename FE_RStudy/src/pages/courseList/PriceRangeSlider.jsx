// Thanh kéo hai đầu bằng hai input range chồng lên nhau: giữ hỗ trợ bàn phím và trình đọc màn hình của input gốc.
// Chỉ núm kéo nhận chuột (pointer-events), phần rãnh trong suốt để hai input không che nhau.
const thumb =
  "pointer-events-none absolute inset-0 h-11 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white " +
  "focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-primary-light/40 " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white";

export default function PriceRangeSlider({ min, max, limit, step, onChange, formatValue }) {
  const minPct = (min / limit) * 100;
  const maxPct = (max / limit) * 100;

  return (
    <div className="relative h-11">
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-line" />
      <div aria-hidden="true" className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary" style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }} />
      <input
        type="range"
        min={0}
        max={limit}
        step={step}
        value={min}
        onChange={(event) => onChange([Math.min(Number(event.target.value), max), max])}
        aria-label="Học phí tối thiểu"
        aria-valuetext={formatValue(min)}
        // Khi núm thấp đẩy sát đầu phải thì đưa lên trên để vẫn kéo ngược lại được
        className={`${thumb} ${min > limit * 0.9 ? "z-10" : ""}`}
      />
      <input
        type="range"
        min={0}
        max={limit}
        step={step}
        value={max}
        onChange={(event) => onChange([min, Math.max(Number(event.target.value), min)])}
        aria-label="Học phí tối đa"
        aria-valuetext={formatValue(max)}
        className={thumb}
      />
    </div>
  );
}
