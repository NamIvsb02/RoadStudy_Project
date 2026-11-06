const TIME_ZONE = 'Asia/Ho_Chi_Minh';
const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export const formatPrice = (value) => {
  const amount = Number(value);
  return amount > 0 ? priceFormatter.format(amount) : 'Miễn phí';
};

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('vi-VN', { timeZone: TIME_ZONE }) : '';

export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('vi-VN', {
        timeZone: TIME_ZONE,
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : '';

export const assetUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return `${import.meta.env.VITE_ASSET_URL ?? ''}${path}`;
};