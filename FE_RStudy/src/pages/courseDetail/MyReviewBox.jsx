import { useState } from 'react';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/ui/Button';
import ReviewForm from './ReviewForm';

export default function MyReviewBox({ review, onSave }) {
  const [editing, setEditing] = useState(false);

  const handleSave = async (values) => {
    await onSave(values);
    setEditing(false);
  };

  if (review && !editing) {
    return (
      <div className="mb-4 space-y-2 rounded-lg border border-primary/30 p-4">
        <p className="text-sm font-medium text-primary">Đánh giá của bạn</p>
        <StarRating value={review.rating} />
        {review.content && <p className="text-slate-700">{review.content}</p>}
        <Button variant="ghost" onClick={() => setEditing(true)}>
          Sửa đánh giá
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg border border-slate-200 p-4">
      <p className="mb-3 text-sm font-medium text-slate-700">
        {review ? 'Sửa đánh giá của bạn' : 'Viết đánh giá của bạn'}
      </p>
      <ReviewForm
        initial={review}
        submitLabel={review ? 'Lưu thay đổi' : 'Gửi đánh giá'}
        onSubmit={handleSave}
        onCancel={review ? () => setEditing(false) : undefined}
      />
    </div>
  );
}