import { assetUrl } from '../../utils/format';

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-2xl',
};

export default function Avatar({ src, name = '', size = 'md' }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  if (src) {
    return (
      <img
        src={assetUrl(src)}
        alt={name}
        className={`${SIZES[size]} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full bg-soft font-semibold text-primary`}
    >
      {initial}
    </span>
  );
}