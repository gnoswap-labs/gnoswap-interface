export const DEFAULT_NETWORK_ID = "portal-loop";

export const PATH = ["/earn"];
// 10SECOND/60SECOND is the specific time for data refetching cycles. `useGetPositionsByAddress` will refetch after these specific time
export const PATH_10SECOND = [
  "/earn/pool/[pool-path]/remove",
  "/tokens/[token-path]",
];
export const PATH_60SECOND = [
  "/wallet",
  "/earn/pool/[pool-path]/stake",
  "/earn/pool/[pool-path]/unstake",
  "/earn/pool/[pool-path]",
];
