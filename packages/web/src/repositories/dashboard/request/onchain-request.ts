export type ActivityType =
  | "All"
  | "Swaps"
  | "Adds"
  | "Removes"
  | "Stakes"
  | "Unstakes"
  | "Claims";

export interface OnchainRequest {
  type: ActivityType;
}

export const OnChainRequestMapping: Record<OnchainRequest["type"], string> = {
  All: "ALL",
  Swaps: "SWAP",
  Adds: "ADD",
  Removes: "REMOVE",
  Stakes: "STAKE",
  Unstakes: "UNSTAKE",
  Claims: "CLAIM",
};
