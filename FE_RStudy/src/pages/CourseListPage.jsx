import { useCallback, useMemo } from 'react';
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
import CourseFilterSidebar from './courseList/CourseFilterSidebar';

const PAGE_SIZE = 9;
const loadCategories = () => categoryApi.getPublicList({ limit: 100 });
const FILTER_KEYS = ['q', 'categoryId', 'sort', 'minPrice', 'maxPrice'];

export default function CourseListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.toString();

  const request = useCallback(
    () => courseApi.getPublicList({ ...Object.fromEntries(new URLSearchParams(query)), limit: PAGE_SIZE }),
    [query],
  );
  const courses = useFetch(request);
  const categories = useFetch(loadCategories);

  const updateParams = useCallback(
    (patch) =>
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        Object.entries(patch).forEach(([key, value]) => {
          if (value) next.set(key, value);
          else next.delete(key);
        });
        if (!('page' in patch)) next.delete('page');
        return next;
      }),
    [setSearchParams],
  );

  const filterValues = useMemo(() => {
    const params = new URLSearchParams(query);
    return {
      q: params.get('q') ?? '',
      categoryId: params.get('categoryId') ?? '',
      sort: params.get('sort') ?? 'newest',
      minPrice: params.get('minPrice') ?? '',
      maxPrice: params.get('maxPrice') ?? '',
    };
  }, [query]);

  const handleReset = useCallback(() => updateParams(Object.fromEntries(FILTER_KEYS.map((key) => [key, '']))), [updateParams]);

  const { items = [], pagination } = courses.data ?? {};

  let content;
  if (courses.loading) content = <CourseCardSkeleton count={PAGE_SIZE} />;
  else if (courses.error) content = <ErrorState message={courses.error} onRetry={courses.reload} />;
  else if (items.length === 0)
    content = (
      <EmptyState
        title="Không tìm thấy khóa học phù hợp"
        description="Thử bỏ bớt từ khóa, mở rộng khoảng học phí hoặc chọn danh mục Tất cả."
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
    <PageColumns
      left={<CourseFilterSidebar values={filterValues} categories={categories.data?.items} onChange={updateParams} onReset={handleReset} />}
    >
      <header className="mb-5">
        <p className="mb-1 text-xs font-semibold tracking-wider text-primary uppercase">Khám phá</p>
        <h1 className="text-headline font-bold text-ink-strong">Khóa học</h1>
        {pagination && <p className="mt-1 text-sm text-muted">{pagination.total} khóa học phù hợp</p>}
      </header>
      {content}
    </PageColumns>
  );
}
