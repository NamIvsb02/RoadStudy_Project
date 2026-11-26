import RevealGroup from "../../components/common/RevealGroup";
import { CONTAINER } from "./homeLayout";

const ITEMS = [
  { key: "courses", label: "Khóa học đang mở" },
  { key: "teachers", label: "Giáo viên đã được duyệt" },
  { key: "categories", label: "Danh mục" },
];

export default function HomeStats({ courses, teachers, categories }) {
  const totals = {
    courses: courses.data?.pagination?.total,
    teachers: teachers.data?.pagination?.total,
    categories: categories.data?.pagination?.total,
  };
  const visible = ITEMS.filter((item) => Number.isFinite(totals[item.key]) && totals[item.key] > 0);
  if (visible.length === 0) return null;

  return (
    <section aria-label="Số liệu RoadStudy" className="border-y border-line bg-white">
      <RevealGroup className={`${CONTAINER} grid divide-x divide-line`} style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}>
        {visible.map((item) => (
          <div key={item.key} className="px-3 py-6 text-center sm:py-8">
            <p className="text-headline font-bold text-primary">{totals[item.key]}</p>
            <p className="mt-1 text-xs text-muted sm:text-sm">{item.label}</p>
          </div>
        ))}
      </RevealGroup>
    </section>
  );
}
