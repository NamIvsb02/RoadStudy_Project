import { useState } from "react";
import Button from "../../../components/ui/Button";
import FormAlert from "../../../components/ui/FormAlert";
import TextField from "../../../components/ui/TextField";

export default function ReportActionForm({ title, label, confirmLabel, danger = false, onSubmit, onCancel }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) {
      setError(`Vui lòng nhập ${label.toLowerCase()}`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit(value);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <TextField id="report-action-text" label={label} required multiline rows={4} maxLength={2000} value={text} onChange={(event) => setText(event.target.value)} />
      <FormAlert message={error} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Hủy
        </Button>
        <Button type="submit" variant={danger ? "danger" : "primary"} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </form>
  );
}
