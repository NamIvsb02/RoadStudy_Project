const ZONE = "Asia/Ho_Chi_Minh";
const dayFormatter = new Intl.DateTimeFormat("vi-VN", { timeZone: ZONE, weekday: "long", day: "2-digit", month: "2-digit" });
const timeFormatter = new Intl.DateTimeFormat("vi-VN", { timeZone: ZONE, hour: "2-digit", minute: "2-digit", hour12: false });
const inputFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

export const formatSessionTime = (start, end) => `${dayFormatter.format(new Date(start))} · ${timeFormatter.format(new Date(start))} - ${timeFormatter.format(new Date(end))}`;

export const toInputValue = (iso) => {
  const parts = Object.fromEntries(inputFormatter.formatToParts(new Date(iso)).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
};

export const fromInputValue = (value) => new Date(`${value}:00+07:00`).toISOString();

export const sessionState = (session, now = Date.now()) => {
  if (new Date(session.endTime).getTime() < now) return "PAST";
  return new Date(session.startTime).getTime() <= now ? "LIVE" : "UPCOMING";
};
