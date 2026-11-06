import { useState } from 'react';
import { commentApi } from '../../api/commentApi';
import ContentForm from '../../components/common/ContentForm';
import InlineConfirmDelete from '../../components/common/InlineConfirmDelete';
import Avatar from '../../components/ui/Avatar';
import { ROLES } from '../../constants/roles';
import { formatDateTime } from '../../utils/format';

export default function ReplyItem({ reply, onChanged }) {
  const [editing, setEditing] = useState(false);
  const { replier } = reply;

  const save = async (content) => {
    await commentApi.updateReply(reply.id, { content });
    setEditing(false);
    onChanged();
  };

  const remove = async () => {
    await commentApi.removeReply(reply.id);
    onChanged();
  };

  return (
    <li className="flex items-start gap-3">
      <Avatar src={replier.avatarUrl} name={replier.fullName} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800">
          {replier.fullName}
          {replier.role === ROLES.TEACHER && (
            <span className="ml-2 rounded bg-accent/10 px-1.5 text-xs text-accent">Giáo viên</span>
          )}
          <span className="ml-2 text-xs font-normal text-slate-500">{formatDateTime(reply.repliedAt)}</span>
        </p>
        {editing ? (
          <div className="mt-2">
            <ContentForm
              defaultValue={reply.content}
              submitLabel="Lưu thay đổi"
              onSubmit={save}
              onCancel={() => setEditing(false)}
            />
          </div>
        ) : (
          <p className="whitespace-pre-line text-sm text-slate-700">{reply.content}</p>
        )}
        {reply.isMine && !editing && (
          <div className="mt-1 flex items-center gap-3">
            <button type="button" onClick={() => setEditing(true)} className="text-sm text-primary hover:underline">
              Sửa
            </button>
            <InlineConfirmDelete onConfirm={remove} />
          </div>
        )}
      </div>
    </li>
  );
}