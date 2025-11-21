import ms from "ms";

export const CacheTime = {
  None: 0,
  Quick: ms("1m"),
  Short: ms("2m"),
  Medium: ms("5m"),
  Long: ms("10m"),
  Extended: ms("30m"),
} as const;

export const StaleTime = {
  None: 0,
  Instant: ms("30s"),
  Fast: ms("1m"),
  Standard: ms("5m"),
} as const;

export const RefetchInterval = {
  None: false,
  Frequent: ms("5s"),
  Regular: ms("10s"),
  Moderate: ms("30s"),
  Rare: ms("1m"),
} as const;
