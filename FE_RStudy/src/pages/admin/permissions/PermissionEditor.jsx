import { useState } from "react";
import { adminApi } from "../../../api/adminApi";
import Button from "../../../components/ui/Button";

export default function PermissionEditor({ admin, functions, onSaved }) {
  const [draft, setDraft] = useState(() => new Set(admin.permissions.map((item) => item.id)));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const saved = new Set(admin.permissions.map((item) => item.id));
  const changed = draft.size !== saved.size || [...draft].some((id) => !saved.has(id));

  const handleToggle = (id) => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await adminApi.setPermissions(admin.id, [...draft]);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <fieldset className="flex flex-col gap-1">
        <legend className="mb-2 text-sm font-semibold text-ink">Quyền được cấp</legend>
        {functions.map((item) => (
          <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 hover:bg-soft">
            <input type="checkbox" checked={admin.isLeader || draft.has(item.id)} disabled={admin.isLeader || saving} onChange={() => handleToggle(item.id)} className="mt-0.5 size-4 accent-primary" />
            <span>
              <span className="block text-sm text-ink">{item.description}</span>
              <span className="block text-xs text-muted">{item.functionName}</span>
            </span>
          </label>
        ))}
      </fieldset>
      {admin.isLeader && <p className="mt-3 text-sm text-muted">Quản trị viên trưởng luôn có toàn quyền, không thể thay đổi.</p>}
      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}
      {!admin.isLeader && (
        <Button className="mt-4" onClick={handleSave} loading={saving} disabled={!changed}>
          Lưu quyền
        </Button>
      )}
    </div>
  );
}
