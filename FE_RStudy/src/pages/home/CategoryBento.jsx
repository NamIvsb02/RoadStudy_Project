import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import ErrorState from "../../components/common/ErrorState";
import SectionHeader from "../../components/common/SectionHeader";
import Skeleton from "../../components/ui/Skeleton";
import Reveal from "../../components/common/Reveal";
import RevealGroup from "../../components/common/RevealGroup";
import { STAGGER } from "../../constants/motion";
import { ROUTES } from "../../constants/routes";
import { CONTAINER } from "./homeLayout";

const MAX_TILES = 7;
const GRID = "grid auto-rows-[7.5rem] grid-cols-2 gap-3 lg:auto-rows-[9rem] lg:grid-cols-4 lg:gap-4";
const TILE = "group flex h-full flex-col justify-between rounded-xl border p-4 transition-[background-color,border-color,transform,box-shadow] duration-200 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover focus-visible:-translate-y-1";
const TILE_LIGHT = `${TILE} border-line bg-white hover:border-primary-200 hover:bg-primary-50`;
const TILE_DARK = `${TILE} border-primary bg-primary text-white hover:border-primary-dark hover:bg-primary-dark`;

function BentoSkeleton() {
  return (
    <div role="status" className={GRID}>
      <span className="sr-only">Đang tải</span>
      {Array.from({ length: 8 }, (_, index) => (
        <Skeleton key={index} className={`h-full rounded-xl ${index === 0 ? "col-span-2 lg:row-span-2" : ""}`} />
      ))}
    </div>
  );
}

export default function CategoryBento({ categories }) {
  const { data, loading, error, reload } = categories;
  const items = [...(data?.items ?? [])].sort((a, b) => b.courseCount - a.courseCount).slice(0, MAX_TILES);

  let content;
  if (loading) content = <BentoSkeleton />;
  else if (error) content = <ErrorState message={error} onRetry={reload} />;
  else if (items.length === 0) return null;
  else {
    content = (
      <RevealGroup variant="scaleReveal" stagger={STAGGER.tight} className={GRID} itemClassName="min-h-0 min-w-0 [&:first-child]:col-span-2 lg:[&:first-child]:row-span-2">
        {items.map((category, index) => (
          <Link key={category.id} to={`${ROUTES.COURSES}?categoryId=${category.id}`} className={`${TILE_LIGHT} ${index === 0 ? "lg:p-6" : ""}`}>
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary-50 text-primary transition-colors duration-200 group-hover:bg-white">
              <BookOpen size={18} />
            </span>
            <span>
              <span className={`line-clamp-2 block font-semibold text-ink-strong ${index === 0 ? "lg:text-xl" : ""}`}>{category.categoryName}</span>
              <span className="text-xs text-muted">{category.courseCount} khóa học</span>
            </span>
          </Link>
        ))}
        <Link to={ROUTES.COURSES} className={TILE_DARK}>
          <ArrowRight size={20} />
          <span className="font-semibold">Xem tất cả khóa học</span>
        </Link>
      </RevealGroup>
    );
  }

  return (
    <section aria-label="Danh mục khóa học" className="bg-page py-12 lg:py-16">
      <div className={CONTAINER}>
        <Reveal>
          <SectionHeader eyebrow="Danh mục" title="Chọn môn bạn quan tâm" description="Các danh mục đang có khóa học mở đăng ký." />
        </Reveal>
        {content}
      </div>
    </section>
  );
}
