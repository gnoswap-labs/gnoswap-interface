export type TierType = "TIER30" | "TIER90" | "TIER180" | null | undefined;

export const getTierNumber = (tier: TierType): number => {
  if (!tier) return 0;
  return parseInt(tier.replace("TIER", ""));
};

export const getTierDuration = (
  tier: TierType,
  format: (key: string, options?: { [key: string]: string | number }) => string,
  isUpperCase?: boolean,
) => {
  if (isUpperCase) {
    switch (tier) {
      case "TIER30":
        return format("Launchpad:common.time.monthUpperCase", { count: 1 });
      case "TIER90":
        return format("Launchpad:common.time.monthUpperCase", { count: 3 });
      case "TIER180":
        return format("Launchpad:common.time.monthUpperCase", { count: 6 });
    }
  } else {
    switch (tier) {
      case "TIER30":
        return format("Launchpad:common.time.month", { count: 1 });
      case "TIER90":
        return format("Launchpad:common.time.month", { count: 3 });
      case "TIER180":
        return format("Launchpad:common.time.month", { count: 6 });
    }
  }
};

export const getTierValue = (tier: TierType) => {
  switch (tier) {
    case "TIER30":
      return 1;
    case "TIER90":
      return 3;
    case "TIER180":
      return 6;
    default:
      return 0;
  }
};
