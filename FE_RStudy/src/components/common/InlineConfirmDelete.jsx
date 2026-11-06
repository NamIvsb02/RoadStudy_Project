import { useState } from 'react';
import Button from '../ui/Button';

export default function InlineConfirmDelete({ onConfirm }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (!confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="text-sm text-red-600 transition-colors duration-150 hover:underline"
        >
          Xóa
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="text-slate-600">Xác nhận xóa?</span>
      <Button variant="danger" className="px-2 py-1" loading={loading} onClick={handleConfirm}>
        Xóa
      </Button>
      <Button variant="ghost" className="px-2 py-1" disabled={loading} onClick={() => setConfirming(false)}>
        Hủy
      </Button>
    </span>
  );
}