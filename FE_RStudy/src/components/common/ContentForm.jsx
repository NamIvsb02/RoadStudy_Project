import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '../ui/Button';
import FieldError from '../ui/FieldError';

const MAX_LENGTH = 1000;

const schema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Nội dung không được để trống')
    .max(MAX_LENGTH, `Nội dung tối đa ${MAX_LENGTH} ký tự`),
});

export default function ContentForm({
  defaultValue = '',
  placeholder,
  submitLabel,
  onSubmit,
  onCancel,
  resetOnSuccess = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { content: defaultValue } });
  const [serverError, setServerError] = useState('');

  const submit = async (values) => {
    setServerError('');
    try {
      await onSubmit(values.content);
      if (resetOnSuccess) reset({ content: '' });
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-2">
      <textarea
        rows={3}
        placeholder={placeholder}
        {...register('content')}
        className="w-full resize-none rounded-lg border border-slate-200 bg-soft px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary"
      />
      <FieldError message={errors.content?.message ?? serverError} />
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