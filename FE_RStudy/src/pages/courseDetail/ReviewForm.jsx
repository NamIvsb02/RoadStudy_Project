import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/ui/Button';
import FieldError from '../../components/ui/FieldError';

const schema = z.object({
  rating: z.number().int().min(1, 'Vui lòng chọn số sao').max(5),
  content: z.string().trim().max(1000, 'Nhận xét tối đa 1000 ký tự'),
});

export default function ReviewForm({ initial, submitLabel, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rating: initial?.rating ?? 0, content: initial?.content ?? '' },
  });
  const rating = useWatch({ control, name: 'rating' });
  const [serverError, setServerError] = useState('');

  const submit = async (values) => {
    setServerError('');
    try {
      await onSubmit(values);
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-3">
      <div>
        <StarRating
          value={rating}
          size={24}
          onChange={(value) => setValue('rating', value, { shouldValidate: true })}
        />
        <FieldError message={errors.rating?.message} />
      </div>
      <div>
        <textarea
          rows={3}
          placeholder="Chia sẻ cảm nhận của bạn về khóa học (không bắt buộc)"
          {...register('content')}
          className="w-full resize-none rounded-lg border border-slate-200 bg-soft px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary"
        />
        <FieldError message={errors.content?.message ?? serverError} />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}