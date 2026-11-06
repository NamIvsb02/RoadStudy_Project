import { useState } from 'react';
import { commentApi } from '../../api/commentApi';
import ContentForm from '../../components/common/ContentForm';
import InlineConfirmDelete from '../../components/common/InlineConfirmDelete';
import Avatar from '../../components/ui/Avatar';
import { ROLES } from '../../constants/roles';
import { formatDateTime } from '../../utils/format';
import ReplyItem from './ReplyItem';

export default function CommentItem({ comment, canWrite, onChanged }) {
  const [mode, setMode] = useState('');
  const { commenter } = comment;

  const finish = () => {
    setMode('');
    onChanged();
  };

  const saveEdit = async (content) => {
    await commentApi.update(comment.id, { content });
    finish();
  };

  const sendReply = async (content) => {
    await commentApi.reply(comment.id, { content });
    finish();
  };

  const remove = async () => {
    await commentApi.remove(comment.id);
    onChanged();
  };

  return (
    <li className="space-y-3 border-b border-slate-100 py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <Avatar src={commenter.avatarUrl} name={commenter.fullName} />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-800">
            {commenter.fullName}
            {commenter.role === ROLES.TEACHER && (
              <span className="ml-2 rounded bg-accent/10 px-1.5 text-xs text-accent">Giáo viên</span>
            )}
            <span className="ml-2 text-xs font-normal text-slate-500">
              {formatDateTime(comment.commentedAt)}
            </span>
          </p>
          {mode === 'edit' ? (
            <div className="mt-2">
              <ContentForm
                defaultValue={comment.content}
                submitLabel="Lưu thay đổi"
                onSubmit={saveEdit}
                onCancel={() => setMode('')}
              />
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-line text-slate-700">{comment.content}</p>
          )}
          {mode !== 'edit' && (
            <div className="mt-1 flex items-center gap-3 text-sm">
              {canWrite && (
                <button type="button" onClick={() => setMode('reply')} className="text-primary hover:underline">
                  Phản hồi
                </button>
              )}
              {comment.isMine && (
                <>
                  <button type="button" onClick={() => setMode('edit')} className="text-primary hover:underline">
                    Sửa
                  </button>
                  <InlineConfirmDelete onConfirm={remove} />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {(comment.replies.length > 0 || mode === 'reply') && (
        <div className="ml-12 space-y-3">
          <ul className="space-y-3">
            {comment.replies.map((reply) => (
              <ReplyItem key={reply.id} reply={reply} onChanged={onChanged} />
            ))}
          </ul>
          {mode === 'reply' && (
            <ContentForm
              placeholder="Nhập phản hồi"
              submitLabel="Gửi phản hồi"
              onSubmit={sendReply}
              onCancel={() => setMode('')}
            />
          )}
        </div>
      )}
    </li>
  );
}