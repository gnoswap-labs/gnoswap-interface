import { CLAIMABLE_DAYS } from "@common/values";
import { safeParseTime } from "./time.utils";

const MILLISECONDS_PER_SECOND = 1000;

// Rewards become claimable after the threshold from max(now, startTime), capped at endTime.
export const getClaimableTime = (claimableThresholdSeconds?: number, startTime?: string, endTime?: string) => {
  if (claimableThresholdSeconds == null) return;

  const startTimestamp = safeParseTime(startTime) ?? 0;
  const endTimestamp = safeParseTime(endTime);
  const claimableTimestamp = Math.max(Date.now(), startTimestamp) + claimableThresholdSeconds * MILLISECONDS_PER_SECOND;

  return new Date(endTimestamp == null ? claimableTimestamp : Math.min(claimableTimestamp, endTimestamp));
};

export const getClaimableDays = (poolTier: string): number => {
  return CLAIMABLE_DAYS[poolTier as keyof typeof CLAIMABLE_DAYS] || 0;
};

export function isLaunchpadPoolEnded(endTime: string | null | undefined): boolean {
  const endTimestamp = safeParseTime(endTime);
  if (endTimestamp == null) {
    return false;
  }
  return Date.now() >= endTimestamp;
}
