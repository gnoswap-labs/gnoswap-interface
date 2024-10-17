export type TierType = "TIER30" | "TIER90" | "TIER180";

export const getTierNumber = (tier: TierType): number => {
  return parseInt(tier.replace("TIER", ""));
};
