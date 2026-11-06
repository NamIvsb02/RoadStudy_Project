import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryApi } from '../api/categoryApi';
import { courseApi } from '../api/courseApi';
import CourseGrid from '../components/common/CourseGrid';
import PageColumns from '../components/common/PageColumns';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';
import Pagination from '../components/ui/Pagination';
import { useFetch } from '../hooks/useFetch';
import CategoryChips from './courseList/CategoryChips';
import CourseFilterBar from './courseList/CourseFilterBar';

const PAGE_SIZE = 9;
const loadCategories = () => categoryApi.getPublicList({ limit: 100 });

export default function CourseListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.toString();
  const page = Number(searchParams.get('page')) || 1;

  const request = useCallback(
    () => courseApi.getPublicList({ ...Object.fromEntries(new URLSearchParams(query)), limit: PAGE_SIZE }),
    [query],
  );
  const courses = useFetch(request);
  const categories = useFetch(loadCategories);

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!('page' in patch)) next.delete('page');
    setSearchParams(next);
  };

  const filterValues = {
    q: searchParams.get('q') ?? '',
    sort: searchParams.get('sort') ?? 'newest',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
  };

  const handleSubmit = (values) =>
    updateParams({
      q: values.q,
      sort: values.sort === 'newest' ? '' : values.sort,
      minPrice: values.minPrice,
      maxPrice: values.maxPrice,
    });

  const handleReset = () => updateParams({ q: '', sort: '', minPrice: '', maxPrice: '' });

  const { items = [], pagination } = courses.data ?? {};

  let content;
  if (courses.loading) content = <LoadingState />;
  else if (courses.error) content = <ErrorState message={courses.error} onRetry={courses.reload} />;
  else if (items.length === 0) content = <EmptyState message="Không tìm thấy khóa học phù hợp" />;
  else
    content = (
      <>
        <CourseGrid courses={items} />
        <Pagination
          page={page}
          totalPages={pagination?.totalPages}
          onChange={(next) => updateParams({ page: String(next) })}
        />
      </>
    );

  return (
    <PageColumns>
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Khóa học</h1>
      <div className="space-y-4">
        {categories.data && (
          <CategoryChips
            categories={categories.data.items}
            activeId={searchParams.get('categoryId') ?? ''}
            onSelect={(id) => updateParams({ categoryId: id })}
          />
        )}
        <CourseFilterBar values={filterValues} onSubmit={handleSubmit} onReset={handleReset} />
        {content}
      </div>
    </PageColumns>
  );
}