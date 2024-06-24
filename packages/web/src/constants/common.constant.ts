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

export const HTTP_5XX_ERROR = [500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511];

export const CAN_SCROLL_UP_ID = "CAN_SCROLL_UP_ID";

export const getCanScrollUpId = (id: string) => `${CAN_SCROLL_UP_ID}_${id}`;