import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn, scaleIn } from "../../constants/motion";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import TextField from "../ui/TextField";

function NoteForm({ label, confirmLabel, danger, children, onSubmit, onCancel }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [loading, onCancel]);

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
    <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-4">
      <TextField id="note-text" label={label} required multiline rows={4} maxLength={1000} value={text} onChange={(event) => setText(event.target.value)} />
      {children}
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

export default function NoteDialog({ open, title, label, confirmLabel, danger = false, children, onSubmit, onCancel }) {
  const titleId = useId();

  return (
    <AnimatePresence>
      {open && (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-[60] flex overflow-y-auto bg-black/40 p-4">
          <motion.div variants={scaleIn} role="dialog" aria-modal="true" aria-labelledby={titleId} className="m-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-card-hover">
            <h2 id={titleId} className="text-lg font-semibold text-ink">
              {title}
            </h2>
            <NoteForm label={label} confirmLabel={confirmLabel} danger={danger} onSubmit={onSubmit} onCancel={onCancel}>
              {children}
            </NoteForm>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
