import { useState } from 'react';
import { reviewApi } from '../../api/reviewApi';
import ContentForm from '../../components/common/ContentForm';
import InlineConfirmDelete from '../../components/common/InlineConfirmDelete';
import StarRating from '../../components/common/StarRating';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { formatDateTime } from '../../utils/format';

export default function ReviewItem({ review, isMine, canRespond, onChanged }) {
  const { account } = useAuth();
  const [mode, setMode] = useState('');
  const response = review.responses[0];
  const ownsResponse = Boolean(response && account?.id === response.account.id);

  const saveResponse = async (content) => {
    if (response) await reviewApi.updateResponse(response.id, { content });
    else await reviewApi.respond(review.id, { content });
    setMode('');
    onChanged();
  };

  const removeResponse = async () => {
    await reviewApi.removeResponse(response.id);
    onChanged();
  };

  return (
    <li className="space-y-3 border-b border-slate-100 py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <Avatar src={review.student.account.avatarUrl} name={review.student.account.fullName} />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-800">
            {review.student.account.fullName}
            {isMine && <span className="ml-2 text-xs text-primary">(Của bạn)</span>}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <StarRating value={review.rating} />
            <span>{formatDateTime(review.reviewedAt)}</span>
          </div>
          {review.content && <p className="mt-2 whitespace-pre-line text-slate-700">{review.content}</p>}
        </div>
      </div>

      {response && mode !== 'edit' && (
        <div className="ml-12 rounded-lg bg-soft p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-800">
              {response.account.fullName}
              <span className="ml-2 rounded bg-accent/10 px-1.5 text-xs text-accent">Giáo viên</span>
            </p>
            <span className="text-xs text-slate-500">{formatDateTime(response.respondedAt)}</span>
          </div>
          <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{response.content}</p>
          {ownsResponse && (
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="text-sm text-primary hover:underline"
              >
                Sửa
              </button>
              <InlineConfirmDelete onConfirm={removeResponse} />
            </div>
          )}
        </div>
      )}

      {mode && (
        <div className="ml-12">
          <ContentForm
            defaultValue={mode === 'edit' ? response.content : ''}
            placeholder="Nhập câu trả lời"
            submitLabel={mode === 'edit' ? 'Lưu thay đổi' : 'Gửi trả lời'}
            onSubmit={saveResponse}
            onCancel={() => setMode('')}
          />
        </div>
      )}

      {canRespond && !response && !mode && (
        <div className="ml-12">
          <Button variant="outline" onClick={() => setMode('create')}>
            Trả lời
          </Button>
        </div>
      )}
    </li>
  );
}