import { zodResolver } from '@hookform/resolvers/zod';
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
  'w-full rounded-lg border border-slate-200 bg-soft px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary';
const labelClass = 'mb-1 block text-xs font-medium text-slate-500';

export default function CourseFilterBar({ values, onSubmit, onReset }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), values });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]"
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
      <div className="flex items-end gap-2">
        <Button type="submit">Tìm kiếm</Button>
        <Button variant="ghost" onClick={onReset}>
          Xóa lọc
        </Button>
      </div>
    </form>
  );
}