import { ValuesType } from "utility-types";

export const LAUNCHPAD_REFETCH_INTERVAL = 60_000;

export const PROJECT_STATUS_TYPE = {
  UPCOMING: "UPCOMING",
  ENDED: "ENDED",
  ONGOING: "ONGOING",
};

export const CLAIMABLE_DAYS = {
  TIER_180: 14,
  TIER_90: 7,
  TIER_30: 3,
};

export type PROJECT_STATUS_TYPE = ValuesType<typeof PROJECT_STATUS_TYPE>;
