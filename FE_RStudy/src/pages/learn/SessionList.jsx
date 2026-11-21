import { useEffect, useState } from "react";
import { formatSessionTime, sessionState } from "./sessionFormat";

const BADGES = {
  LIVE: ["Đang diễn ra", "bg-success/10 text-success"],
  NEXT: ["Sắp diễn ra", "bg-warning/10 text-warning"],
  PAST: ["Đã diễn ra", "bg-muted/10 text-muted"],
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
    <ul>
      {[...upcoming, ...past].map((session) => {
        const state = sessionState(session, now);

        const badge = BADGES[state === "UPCOMING" ? (session.id === nextId ? "NEXT" : "") : state];

        return (
          <li
            key={session.id}
            className={`flex items-center justify-between gap-3 border-b border-line py-3 last:border-b-0 ${state === "PAST" ? "opacity-60" : ""} ${
              session.id === nextId || state === "LIVE" ? "-mx-5 bg-primary/5 px-5" : ""
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{session.title}</p>

              <p className="text-xs text-muted">{formatSessionTime(session.startTime, session.endTime)}</p>

              {session.note && <p className="mt-0.5 text-xs text-muted">{session.note}</p>}
            </div>

            {badge && <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${badge[1]}`}>{badge[0]}</span>}
          </li>
        );
      })}
    </ul>
  );
}
