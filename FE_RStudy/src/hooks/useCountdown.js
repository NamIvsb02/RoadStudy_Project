import { useEffect, useRef, useState } from "react";

const secondsLeft = (endAt) => Math.max(0, Math.ceil((endAt - Date.now()) / 1000));

export function useCountdown(endAt, onExpire, active = true) {
  const [remaining, setRemaining] = useState(() => secondsLeft(endAt));
  const expireRef = useRef(onExpire);

  useEffect(() => {
    expireRef.current = onExpire;
  });

  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => {
      const left = secondsLeft(endAt);
      setRemaining(left);
      if (left <= 0) {
        clearInterval(id);
        expireRef.current();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [endAt, active]);

  return remaining;
}
