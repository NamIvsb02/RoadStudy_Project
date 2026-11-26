import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryApi } from '../api/categoryApi';
import { courseApi } from '../api/courseApi';
import CourseCardSkeleton from '../components/common/CourseCardSkeleton';
import CourseGrid from '../components/common/CourseGrid';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import PageColumns from '../components/common/PageColumns';
import Pagination from '../components/common/Pagination';
import { useFetch } from '../hooks/useFetch';
import CategoryChips from './courseList/CategoryChips';
import CourseFilterBar from './courseList/CourseFilterBar';

const PAGE_SIZE = 9;
const loadCategories = () => categoryApi.getPublicList({ limit: 100 });

export default function CourseListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.toString();

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
  if (courses.loading) content = <CourseCardSkeleton count={PAGE_SIZE} />;
  else if (courses.error) content = <ErrorState message={courses.error} onRetry={courses.reload} />;
  else if (items.length === 0)
    content = (
      <EmptyState
        title="Không tìm thấy khóa học phù hợp"
        description="Thử bỏ bớt từ khóa, mở rộng khoảng giá hoặc chọn danh mục Tất cả."
      />
    );
  else
    content = (
      <>
        <CourseGrid courses={items} />
        <Pagination pagination={pagination} onChange={(next) => updateParams({ page: String(next) })} />
      </>
    );

  return (
    <PageColumns>
      <header className="mb-5">
        <p className="mb-1 text-xs font-semibold tracking-wider text-primary uppercase">Khám phá</p>
        <h1 className="text-headline font-bold text-ink-strong">Khóa học</h1>
        {pagination && <p className="mt-1 text-sm text-muted">{pagination.total} khóa học phù hợp</p>}
      </header>
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
