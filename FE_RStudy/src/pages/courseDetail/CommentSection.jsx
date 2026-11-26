import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { commentApi } from '../../api/commentApi';
import ContentForm from '../../components/common/ContentForm';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import Pagination from '../../components/common/Pagination';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import CommentItem from './CommentItem';

const PAGE_SIZE = 10;

// Đổi người dùng (đăng nhập/đăng xuất) thì tải lại danh sách để cờ isMine đúng
export default function CommentSection({ courseId }) {
  const { account } = useAuth();
  return <CommentList key={account?.id ?? 'guest'} courseId={courseId} />;
}

function CommentList({ courseId }) {
  const { account, loading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const canWrite = account?.role === ROLES.STUDENT || account?.role === ROLES.TEACHER;
  const loggedIn = Boolean(account);

  // Khách cũng xem được bình luận (isMine luôn false khi chưa đăng nhập)
  const request = useCallback(() => commentApi.listByCourse(courseId, { page, limit: PAGE_SIZE }), [courseId, page]);
  const { data, loading, error, reload } = useFetch(request);

  const createComment = async (content) => {
    await commentApi.create(courseId, { content });
    if (page !== 1) setPage(1);
    else reload();
  };

  let content;
  if (authLoading || (loading && !data)) content = <LoadingState />;
  else if (error) content = <ErrorState message={error} onRetry={reload} />;
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
        {!loggedIn && (
          <p className="mb-4 text-muted">
            <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
              Đăng nhập
            </Link>{' '}
            để tham gia bình luận.
          </p>
        )}
        {data.items.length === 0 ? (
          <EmptyState title="Chưa có bình luận nào" />
        ) : (
          <ul>
            {data.items.map((comment) => (
              <CommentItem key={comment.id} comment={comment} canWrite={canWrite} onChanged={reload} />
            ))}
          </ul>
        )}
        <Pagination pagination={data.pagination} onChange={setPage} />
      </>
    );
  }

  return (
    <section className="rounded-xl border border-line bg-white p-5 shadow-card">
      <h2 className="mb-4 text-lg font-bold text-ink-strong">Bình luận</h2>
      {content}
    </section>
  );
}