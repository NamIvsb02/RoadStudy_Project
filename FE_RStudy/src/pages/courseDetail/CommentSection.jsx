import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { commentApi } from '../../api/commentApi';
import ContentForm from '../../components/common/ContentForm';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';
import Pagination from '../../components/ui/Pagination';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import CommentItem from './CommentItem';

const PAGE_SIZE = 10;

export default function CommentSection({ courseId }) {
  const { account, loading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const canWrite = account?.role === ROLES.STUDENT || account?.role === ROLES.TEACHER;
  const loggedIn = Boolean(account);

  const request = useCallback(
    () =>
      loggedIn
        ? commentApi.listByCourse(courseId, { page, limit: PAGE_SIZE })
        : Promise.resolve({ data: null }),
    [courseId, page, loggedIn],
  );
  const { data, loading, error, reload } = useFetch(request);

  const createComment = async (content) => {
    await commentApi.create(courseId, { content });
    if (page !== 1) setPage(1);
    else reload();
  };

  let content;
  if (authLoading || (loggedIn && loading && !data)) content = <LoadingState />;
  else if (!loggedIn) {
    content = (
      <p className="text-slate-600">
        <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
          Đăng nhập
        </Link>{' '}
        để xem và tham gia bình luận.
      </p>
    );
  } else if (error) content = <ErrorState message={error} onRetry={reload} />;
  else {
    content = (
      <>
        {canWrite && (
          <div className="mb-4">
            <ContentForm
              placeholder="Viết bình luận của bạn"
              submitLabel="Gửi bình luận"
              resetOnSuccess
              onSubmit={createComment}
            />
          </div>
        )}
        {data.items.length === 0 ? (
          <EmptyState message="Chưa có bình luận nào" />
        ) : (
          <ul>
            {data.items.map((comment) => (
              <CommentItem key={comment.id} comment={comment} canWrite={canWrite} onChanged={reload} />
            ))}
          </ul>
        )}
        <Pagination page={page} totalPages={data.pagination.totalPages} onChange={setPage} />
      </>
    );
  }

  return (
    <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-800">Bình luận</h2>
      {content}
    </section>
  );
}