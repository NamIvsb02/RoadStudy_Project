import { useEffect, useState } from "react";
import { formatSessionTime, sessionState } from "./sessionFormat";

const BADGES = {
  LIVE: ["Đang diễn ra", "bg-success/10 text-success-strong"],
  NEXT: ["Sắp diễn ra", "bg-warning/10 text-warning-strong"],
  PAST: ["Đã diễn ra", "bg-muted/10 text-muted"],
};

const DOTS = {
  LIVE: "border-success bg-success",
  NEXT: "border-primary bg-primary",
  UPCOMING: "border-primary bg-white",
  PAST: "border-line-strong bg-surface",
};

export default function SessionList({ sessions }) {
  const [now, setNow] = useState(null);

  useEffect(function () {
    function updateTime() {
      setNow(Date.now());
    }

    updateTime();

    const intervalId = setInterval(updateTime, 60000);

    return function () {
      clearInterval(intervalId);
    };
  }, []);

  if (sessions.length === 0) {
    return <p className="py-6 text-center text-sm text-muted">Giáo viên chưa xếp lịch học.</p>;
  }

  if (now === null) {
    return null;
  }

  const nextId = sessions.find((session) => sessionState(session, now) === "UPCOMING")?.id;

  const upcoming = sessions.filter((session) => sessionState(session, now) !== "PAST");

  const past = sessions.filter((session) => sessionState(session, now) === "PAST").reverse();

  return (
    <ol className="relative ml-2 border-l-2 border-line">
      {[...upcoming, ...past].map((session) => {
        const state = sessionState(session, now);
        const isNext = state === "UPCOMING" && session.id === nextId;
        const badge = BADGES[isNext ? "NEXT" : state === "UPCOMING" ? "" : state];
        const dot = DOTS[isNext ? "NEXT" : state];
        const highlighted = isNext || state === "LIVE";

        return (
          <li key={session.id} className="relative pb-4 pl-6 last:pb-0">
            <span aria-hidden="true" className={`absolute top-4 -left-[9px] size-4 rounded-full border-2 ${dot}`} />
            <div className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 ${highlighted ? "border-primary-200 bg-primary-50" : "border-line bg-white"} ${state === "PAST" ? "opacity-70" : ""}`}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{session.title}</p>
                <p className="mt-0.5 text-xs text-muted">{formatSessionTime(session.startTime, session.endTime)}</p>
                {session.note && <p className="mt-1 text-xs text-muted">{session.note}</p>}
              </div>
              {badge && <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${badge[1]}`}>{badge[0]}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
