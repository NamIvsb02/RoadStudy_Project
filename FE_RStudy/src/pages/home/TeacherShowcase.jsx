import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generatePath, Link } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Reveal from "../../components/common/Reveal";
import RevealGroup from "../../components/common/RevealGroup";
import SectionHeader from "../../components/common/SectionHeader";
import Avatar from "../../components/ui/Avatar";
import Skeleton from "../../components/ui/Skeleton";
import { ROUTES } from "../../constants/routes";
import { assetUrl } from "../../utils/format";
import { CONTAINER } from "./homeLayout";

const SCROLL_STEP = 600;
const arrowClass =
  "hidden size-11 items-center justify-center rounded-full border border-line bg-white text-primary transition-colors duration-150 hover:border-line-strong hover:bg-primary-50 lg:inline-flex";

function TeacherPhoto({ account }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const url = assetUrl(account.avatarUrl);

  if (url && failedUrl !== url) {
    return (
      <img src={url} alt={account.fullName} loading="lazy" onError={() => setFailedUrl(url)} className="size-full object-cover transition-transform duration-300 ease-out-soft motion-safe:group-hover:scale-105" />
    );
  }
  return (
    <div className="flex size-full items-center justify-center bg-primary-50">
      <Avatar name={account.fullName} size="xl" />
    </div>
  );
}

function TeacherSkeleton() {
  return (
    <div role="status" className="flex gap-4 overflow-hidden">
      <span className="sr-only">Đang tải</span>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="w-56 shrink-0 space-y-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function TeacherShowcase({ teachers }) {
  const trackRef = useRef(null);
  const { data, loading, error, reload } = teachers;
  const scrollBy = (direction) => trackRef.current?.scrollBy({ left: direction * SCROLL_STEP, behavior: "smooth" });

  let content;
  if (loading) content = <TeacherSkeleton />;
  else if (error) content = <ErrorState message={error} onRetry={reload} />;
  else if (data.items.length === 0) content = <EmptyState title="Chưa có giáo viên" />;
  else {
    content = (
      <RevealGroup ref={trackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2" itemClassName="w-56 shrink-0 snap-start">
        {data.items.map(({ id, specialization, account }) => (
          <Link key={id} to={generatePath(ROUTES.TEACHER_PROFILE, { id })} className="group block">
            <div className="isolate aspect-square overflow-hidden rounded-xl border border-line">
              <TeacherPhoto account={account} />
            </div>
            <p className="mt-3 line-clamp-1 font-semibold text-ink-strong">{account.fullName}</p>
            <p className="line-clamp-1 text-sm text-muted">{specialization}</p>
          </Link>
        ))}
      </RevealGroup>
    );
  }

  return (
    <section aria-label="Giáo viên tiêu biểu" className="bg-white py-12 lg:py-16">
      <div className={CONTAINER}>
        <Reveal className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <SectionHeader eyebrow="Giáo viên của RoadStudy" title="Giáo viên tiêu biểu"  />
          </div>
          {data?.items.length > 0 && (
            <div className="mb-5 flex gap-2">
              <button type="button" aria-label="Cuộn sang trái" onClick={() => scrollBy(-1)} className={arrowClass}>
                <ChevronLeft size={20} />
              </button>
              <button type="button" aria-label="Cuộn sang phải" onClick={() => scrollBy(1)} className={arrowClass}>
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </Reveal>
        {content}
      </div>
    </section>
  );
}
