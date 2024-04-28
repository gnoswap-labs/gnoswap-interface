export interface OnchainRequest {
  type: "All" | "Swaps" | "Adds" | "Removes" | "Stakes" | "Unstakes";
}

export const OnChainRequestMapping: Record<OnchainRequest["type"], string> = {
  All: "ALL",
  Swaps: "SWAP",
  Adds: "ADD",
  Removes: "REMOVE",
  Stakes: "STAKE",
  Unstakes: "UNSTAKE",
};
