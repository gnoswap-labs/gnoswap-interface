import { CLAIMABLE_DAYS } from "@common/values";
import { safeParseTime } from "./time.utils";

const MILLISECONDS_PER_SECOND = 1000;

export const getClaimableTime = (claimableThresholdSeconds?: number) => {
  if (claimableThresholdSeconds == null) return;

  return new Date(Date.now() + claimableThresholdSeconds * MILLISECONDS_PER_SECOND);
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
