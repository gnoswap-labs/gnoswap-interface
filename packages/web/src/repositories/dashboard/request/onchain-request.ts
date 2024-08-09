export interface OnchainRequest {
  type:
    | "All"
    | "Swaps"
    | "Adds"
    | "Removes"
    | "Stakes"
    | "Unstakes"
    | "Claims";
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
