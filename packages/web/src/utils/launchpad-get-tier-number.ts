export type TierType = "TIER30" | "TIER90" | "TIER180";

export const getTierNumber = (tier: TierType): number => {
  return parseInt(tier.replace("TIER", ""));
};

export const getTierDuration = (tier: TierType) => {
  switch (tier) {
    case "TIER30":
      return "1 Month";
    case "TIER90":
      return "3 Months";
    case "TIER180":
      return "6 Months";
  }
};
