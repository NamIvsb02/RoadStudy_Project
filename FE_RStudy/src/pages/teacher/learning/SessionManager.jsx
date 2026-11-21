import { useState } from "react";
import { learningApi } from "../../../api/learningApi";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Button from "../../../components/ui/Button";
import { formatSessionTime } from "../../learn/sessionFormat";
import SessionDialog from "./SessionDialog";

export default function SessionManager({ courseId, sessions, onChanged }) {
  const [dialog, setDialog] = useState(null);
  const [target, setTarget] = useState(null);
  const [error, setError] = useState("");

  const handleSave = async (body) => {
    if (dialog.session) await learningApi.updateSession(dialog.session.id, body);
    else await learningApi.createSession(courseId, body);
    setDialog(null);
    onChanged();
  };

  const handleDelete = async () => {
    const session = target;
    setTarget(null);
    setError("");
    try {
      await learningApi.removeSession(session.id);
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">Lịch học online</h2>
        <Button onClick={() => setDialog({ session: null })}>Thêm buổi học</Button>
      </div>
      {error && (
        <p role="alert" className="mb-2 text-sm text-danger">
          {error}
        </p>
      )}
      {sessions.length === 0 && <p className="py-6 text-center text-sm text-muted">Chưa có buổi học nào.</p>}
      <ul>
        {sessions.map((session) => (
          <li key={session.id} className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-b-0">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{session.title}</p>
              <p className="text-xs text-muted">{formatSessionTime(session.startTime, session.endTime)}</p>
            </div>
            <div className="flex shrink-0 gap-3 text-xs font-semibold">
              <button type="button" onClick={() => setDialog({ session })} className="text-primary hover:underline">
                Sửa
              </button>
              <button type="button" onClick={() => setTarget(session)} className="text-danger hover:underline">
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
      <SessionDialog dialog={dialog} onSubmit={handleSave} onClose={() => setDialog(null)} />
      <ConfirmDialog open={Boolean(target)} title="Xóa buổi học?" message={target?.title} confirmLabel="Xóa" danger onConfirm={handleDelete} onCancel={() => setTarget(null)} />
    </section>
  );
}
