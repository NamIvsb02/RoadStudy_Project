import { useCallback } from 'react';
import { courseApi } from '../../api/courseApi';
import CourseGrid from '../../components/common/CourseGrid';
import SectionHeader from '../../components/common/SectionHeader';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';
import { ROUTES } from '../../constants/routes';
import { useFetch } from '../../hooks/useFetch';

const LIMIT = 6;

export default function CategoryCourseSection({ category }) {
  const request = useCallback(
    () => courseApi.getPublicList({ categoryId: category.id, limit: LIMIT }),
    [category.id],
  );
  const { data, loading, error, reload } = useFetch(request);

  let content;
  if (loading) content = <LoadingState />;
  else if (error) content = <ErrorState message={error} onRetry={reload} />;
  else if (data.items.length === 0) return null;
  else content = <CourseGrid courses={data.items} />;

  return (
    <section className="mt-8">
      <SectionHeader
        title={category.categoryName}
        actionTo={`${ROUTES.COURSES}?categoryId=${category.id}`}
      />
      {content}
    </section>
  );
}