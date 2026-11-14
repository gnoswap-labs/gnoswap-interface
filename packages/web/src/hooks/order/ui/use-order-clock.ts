import { useEffect, useState } from "react";

/** Order countdowns read in whole minutes, so a minute is as often as their clock has to move. */
const ORDER_CLOCK_INTERVAL_MS = 60_000;

/** The current Unix time in seconds, refreshed every minute for as long as the component is mounted. */
export const useOrderClock = (): number => {
  const [unixSeconds, setUnixSeconds] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => setUnixSeconds(Math.floor(Date.now() / 1000)), ORDER_CLOCK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return unixSeconds;
};
