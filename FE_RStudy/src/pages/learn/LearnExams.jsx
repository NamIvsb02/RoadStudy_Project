import { useCallback, useEffect, useRef } from "react";
import { Link, generatePath } from "react-router-dom";
import { examApi } from "../../api/examApi";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import ListSkeleton from "../../components/common/ListSkeleton";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import { formatScore } from "../exam/examFormat";

export default function LearnExams({ courseId }) {
  const request = useCallback(() => examApi.listByCourse(courseId, { limit: 50 }), [courseId]);
  const { data, loading, error, reload } = useFetch(request);
  const trackRef = useRef(null);
  const items = data?.items ?? [];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const handleWheel = (event) => {
      if (track.scrollWidth <= track.clientWidth || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const atStart = track.scrollLeft <= 0 && event.deltaY < 0;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1 && event.deltaY > 0;
      if (atStart || atEnd) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    };
    track.addEventListener("wheel", handleWheel, { passive: false });
    return () => track.removeEventListener("wheel", handleWheel);
  }, [items.length]);

  let body;
  if (loading) body = <ListSkeleton rows={2} />;
  else if (error) body = <ErrorState message={error} onRetry={reload} />;
  else if (items.length === 0) body = <EmptyState title="Chưa có đề thi" description="Khóa học này chưa có đề thi nào đang mở." />;
  else {
    body = (
      <div ref={trackRef} className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-3 [scrollbar-width:thin]">
        {items.map((exam) => (
          <Link key={exam.id} to={generatePath(ROUTES.EXAM_DETAIL, { id: exam.id })} className="block w-64 shrink-0 snap-start rounded-xl border border-line p-4 transition-[background-color,border-color,box-shadow] duration-200 hover:border-primary-200 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light">
            <p className="font-semibold text-ink">{exam.examName}</p>
            <p className="mt-1 text-sm text-muted">
              {exam.questionCount} câu · {exam.durationMinutes} phút · đạt từ {formatScore(exam.passingScore)} điểm
            </p>
            <p className="mt-2 text-xs font-medium text-primary">
              Đã làm {exam.attemptsUsed}/{exam.maxAttempts} lượt
            </p>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-ink">Bài thi</h2>
      {body}
    </section>
  );
}
