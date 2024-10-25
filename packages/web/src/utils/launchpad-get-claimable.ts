import { CLAIMABLE_DAYS } from "@common/values";

export const getClaimableTime = (threshold?: number) => {
  if (threshold == null) return;

  return new Date(Date.now() + threshold);
};

export const getClaimableDays = (poolTier: string): number => {
  return CLAIMABLE_DAYS[poolTier as keyof typeof CLAIMABLE_DAYS] || 0;
};
