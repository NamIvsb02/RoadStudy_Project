export const formatDuration = (seconds) => {
  const total = Math.max(0, Math.round(seconds));
  return `${Math.floor(total / 60)} phút ${String(total % 60).padStart(2, "0")} giây`;
};

export const durationBetween = (startIso, endIso) => (startIso && endIso ? (new Date(endIso) - new Date(startIso)) / 1000 : null);

export const formatScore = (value) => (value === null || value === undefined ? "–" : Number(value).toLocaleString("vi-VN"));
