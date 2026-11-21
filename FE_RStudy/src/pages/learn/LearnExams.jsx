import { useCallback, useEffect, useRef } from "react";
import { Link, generatePath } from "react-router-dom";
import { examApi } from "../../api/examApi";
import LoadingState from "../../components/ui/LoadingState";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import { formatScore } from "../exam/examFormat";

export default function LearnExams({ courseId }) {
  const request = useCallback(() => examApi.listByCourse(courseId, { limit: 50 }), [courseId]);
  const { data, loading, error } = useFetch(request);
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
  if (loading) body = <LoadingState />;
  else if (error) body = <p className="py-4 text-sm text-danger">{error}</p>;
  else if (items.length === 0) body = <p className="py-4 text-sm text-muted">Khóa học này chưa có đề thi nào đang mở.</p>;
  else {
    body = (
      <div ref={trackRef} className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-3 [scrollbar-width:thin]">
        {items.map((exam) => (
          <Link key={exam.id} to={generatePath(ROUTES.EXAM_DETAIL, { id: exam.id })} className="w-64 shrink-0 snap-start rounded-xl border border-line p-4 transition-colors hover:bg-soft">
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
      <h2 className="mb-3 text-base font-semibold text-ink">Bài thi</h2>
      {body}
    </section>
  );
}
