export type TierType = "TIER_30" | "TIER_90" | "TIER_180" | null | undefined;

export const getTierNumber = (tier: TierType): number => {
  if (!tier) return 0;
  return parseInt(tier.split("_")[1]);
};

export const getTierDuration = (
  tier: TierType,
  format: (key: string, options?: { [key: string]: string | number }) => string,
  isUpperCase?: boolean,
) => {
  if (isUpperCase) {
    switch (tier) {
      case "TIER_30":
        return format("Launchpad:common.time.monthUpperCase", { count: 1 });
      case "TIER_90":
        return format("Launchpad:common.time.monthUpperCase", { count: 3 });
      case "TIER_180":
        return format("Launchpad:common.time.monthUpperCase", { count: 6 });
    }
  } else {
    switch (tier) {
      case "TIER_30":
        return format("Launchpad:common.time.month", { count: 1 });
      case "TIER_90":
        return format("Launchpad:common.time.month", { count: 3 });
      case "TIER_180":
        return format("Launchpad:common.time.month", { count: 6 });
    }
  }
};

export const getTierValue = (tier: TierType) => {
  switch (tier) {
    case "TIER_30":
      return 1;
    case "TIER_90":
      return 3;
    case "TIER_180":
      return 6;
    default:
      return 0;
  }
};
