export type TierType = "TIER30" | "TIER90" | "TIER180" | null | undefined;

export const getTierNumber = (tier: TierType): number => {
  if (!tier) return 0;
  return parseInt(tier.replace("TIER", ""));
};

export const getTierDuration = (
  tier: TierType,
  format: (key: string, options?: { [key: string]: string | number }) => string,
) => {
  switch (tier) {
    case "TIER30":
      return format("Launchpad:common.tierDuration.1month");
    case "TIER90":
      return format("Launchpad:common.tierDuration.3months");
    case "TIER180":
      return format("Launchpad:common.tierDuration.6months");
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
