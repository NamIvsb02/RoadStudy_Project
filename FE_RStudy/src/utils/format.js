const VN_TIME_ZONE = "Asia/Ho_Chi_Minh";
const ASSET_URL = (import.meta.env.VITE_ASSET_URL ?? "").replace(/\/$/, "");

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: VN_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: VN_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const moneyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const toDate = (iso) => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatVND = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const amount = Number(value);
  return Number.isNaN(amount) ? "" : moneyFormatter.format(amount);
};

export const formatDate = (iso) => {
  const date = toDate(iso);
  return date ? dateFormatter.format(date) : "";
};

export const formatDateTime = (iso) => {
  const date = toDate(iso);
  return date ? `${timeFormatter.format(date)} ${dateFormatter.format(date)}` : "";
};

export const assetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSET_URL}/${path.replace(/^\//, "")}`;
};

export const getInitials = (name) => {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return words
    .slice(-2)
    .map((word) => word[0].toUpperCase())
    .join("");
};
