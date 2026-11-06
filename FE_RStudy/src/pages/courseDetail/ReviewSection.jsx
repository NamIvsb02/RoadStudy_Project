import { useCallback, useState } from 'react';
import { reviewApi } from '../../api/reviewApi';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';
import Pagination from '../../components/ui/Pagination';
import { ROLES } from '../../constants/roles';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import MyReviewBox from './MyReviewBox';
import ReviewItem from './ReviewItem';
import ReviewSummary from './ReviewSummary';

const PAGE_SIZE = 5;

export default function ReviewSection({ courseId, teacherId }) {
  const { account } = useAuth();
  const isStudent = account?.role === ROLES.STUDENT;
  const canRespond = account?.role === ROLES.TEACHER && account.teacher?.id === teacherId;
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState(0);

  const listRequest = useCallback(
    () => reviewApi.listByCourse(courseId, { page, limit: PAGE_SIZE, rating: rating || undefined }),
    [courseId, page, rating],
  );
  const mineRequest = useCallback(
    () => (isStudent ? reviewApi.getMine(courseId) : Promise.resolve({ data: null })),
    [courseId, isStudent],
  );
  const list = useFetch(listRequest);
  const mine = useFetch(mineRequest);

  const refresh = () => {
    list.reload();
    mine.reload();
  };

  const saveMine = async (values) => {
    if (mine.data) await reviewApi.update(mine.data.id, values);
    else await reviewApi.create(courseId, values);
    refresh();
  };

  const filterByRating = (value) => {
    setRating(value);
    setPage(1);
  };

  let content;
  if (list.loading && !list.data) content = <LoadingState />;
  else if (list.error) content = <ErrorState message={list.error} onRetry={list.reload} />;
  else {
    const { summary, items, pagination } = list.data;
    content = (
      <>
        <ReviewSummary summary={summary} rating={rating} onFilter={filterByRating} />
        {isStudent && !mine.loading && <MyReviewBox review={mine.data} onSave={saveMine} />}
        {items.length === 0 ? (
          <EmptyState message="Chưa có đánh giá nào" />
        ) : (
          <ul>
            {items.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                isMine={mine.data?.id === review.id}
                canRespond={canRespond}
                onChanged={list.reload}
              />
            ))}
          </ul>
        )}
        <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />
      </>
    );
  }

  return (
    <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-800">Đánh giá</h2>
      {content}
    </section>
  );
}