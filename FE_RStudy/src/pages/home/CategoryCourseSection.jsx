import { useCallback } from "react";
import { courseApi } from "../../api/courseApi";
import CourseCard from "../../components/common/CourseCard";
import CourseCardSkeleton from "../../components/common/CourseCardSkeleton";
import CourseGrid from "../../components/common/CourseGrid";
import ErrorState from "../../components/common/ErrorState";
import Reveal from "../../components/common/Reveal";
import SectionHeader from "../../components/common/SectionHeader";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import { CONTAINER } from "./homeLayout";

const LIMIT = 6;
const SKELETON_CLASS = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

export default function CategoryCourseSection({ category, reversed = false }) {
  const request = useCallback(() => courseApi.getPublicList({ categoryId: category.id, limit: LIMIT }), [category.id]);
  const { data, loading, error, reload } = useFetch(request);

  let content;
  if (loading) content = <CourseCardSkeleton count={3} className={SKELETON_CLASS} />;
  else if (error) content = <ErrorState message={error} onRetry={reload} />;
  else if (data.items.length === 0) return null;
  else if (reversed) {
    content = (
      <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0">
        {data.items.map((course) => (
          <li key={course.id} className="w-72 shrink-0 snap-start lg:w-auto">
            <CourseCard course={course} />
          </li>
        ))}
      </ul>
    );
  } else content = <CourseGrid courses={data.items} animateOnView />;

  const header = (
    <SectionHeader eyebrow="Danh mục" title={category.categoryName} actionTo={`${ROUTES.COURSES}?categoryId=${category.id}`} />
  );

  return (
    <section aria-label={category.categoryName} className={`${reversed ? "bg-white" : "bg-page"} py-12 lg:py-16`}>
      <div className={reversed ? `${CONTAINER} grid gap-6 lg:grid-cols-12 lg:gap-10` : CONTAINER}>
        {reversed ? (
          <>
            <Reveal className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">{header}</div>
            </Reveal>
            <Reveal variant="revealRight" className="min-w-0 lg:col-span-8">
              {content}
            </Reveal>
          </>
        ) : (
          <>
            <Reveal>{header}</Reveal>
            {content}
          </>
        )}
      </div>
    </section>
  );
}
