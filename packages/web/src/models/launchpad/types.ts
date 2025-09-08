export const LAUNCHPAD_STATUS = {
  NONE: "NONE",
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  ENDED: "ENDED",
} as const;
export type LaunchpadStatusType = (typeof LAUNCHPAD_STATUS)[keyof typeof LAUNCHPAD_STATUS];

export const POOL_TIER = {
  TIER_30: "TIER_30",
  TIER_90: "TIER_90",
  TIER_180: "TIER_180",
} as const;
export type PoolTierType = (typeof POOL_TIER)[keyof typeof POOL_TIER];
