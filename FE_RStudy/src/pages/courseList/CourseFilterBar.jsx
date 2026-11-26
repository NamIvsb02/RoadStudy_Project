import { zodResolver } from '@hookform/resolvers/zod';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '../../components/ui/Button';
import FieldError from '../../components/ui/FieldError';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'start_soon', label: 'Sắp khai giảng' },
  { value: 'name', label: 'Tên A đến Z' },
];

const priceField = z.string().trim().regex(/^\d*$/, 'Chỉ nhập số nguyên dương');

const schema = z
  .object({
    q: z.string().trim().max(100, 'Từ khóa tối đa 100 ký tự'),
    sort: z.string(),
    minPrice: priceField,
    maxPrice: priceField,
  })
  .refine((d) => !d.minPrice || !d.maxPrice || Number(d.minPrice) <= Number(d.maxPrice), {
    message: 'Giá thấp nhất không được lớn hơn giá cao nhất',
    path: ['maxPrice'],
  });

const inputClass =
  'h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm outline-none transition-colors duration-150 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30';
const labelClass = 'mb-1 block text-xs font-medium text-muted';

export default function CourseFilterBar({ values, onSubmit, onReset }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), values });
  const [open, setOpen] = useState(false);

  return (
    <div className="z-20 rounded-xl border border-line bg-white shadow-card lg:sticky lg:top-16">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="course-filter-form"
        className="flex min-h-11 w-full items-center gap-2 px-4 text-sm font-semibold text-ink lg:hidden"
      >
        <SlidersHorizontal size={16} />
        Bộ lọc
      </button>
      <form
        id="course-filter-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={`gap-3 p-4 sm:grid-cols-2 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_auto] ${open ? 'grid border-t border-line lg:border-t-0' : 'hidden'}`}
      >
        <div>
          <label className={labelClass} htmlFor="filter-q">
            Tìm kiếm
          </label>
          <input id="filter-q" placeholder="Tên hoặc nội dung khóa học" className={inputClass} {...register('q')} />
          <FieldError message={errors.q?.message} />
        </div>
        <div>
          <label className={labelClass} htmlFor="filter-sort">
            Sắp xếp
          </label>
          <select id="filter-sort" className={inputClass} {...register('sort')}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="filter-min">
            Giá từ (VND)
          </label>
          <input id="filter-min" inputMode="numeric" className={inputClass} {...register('minPrice')} />
          <FieldError message={errors.minPrice?.message} />
        </div>
        <div>
          <label className={labelClass} htmlFor="filter-max">
            Giá đến (VND)
          </label>
          <input id="filter-max" inputMode="numeric" className={inputClass} {...register('maxPrice')} />
          <FieldError message={errors.maxPrice?.message} />
        </div>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
          <Button type="submit">Tìm kiếm</Button>
          <Button variant="ghost" onClick={onReset}>
            Xóa lọc
          </Button>
        </div>
      </form>
    </div>
  );
}
