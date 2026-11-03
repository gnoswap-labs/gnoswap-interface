/** The three modes of the swap card, as written to the `type` query parameter. */
export const SWAP_CARD_TYPE = {
  SWAP: "swap",
  DCA: "dca",
  LIMIT: "limit",
} as const;

export type SwapCardType = (typeof SWAP_CARD_TYPE)[keyof typeof SWAP_CARD_TYPE];

export function isSwapCardType(value: unknown): value is SwapCardType {
  return Object.values(SWAP_CARD_TYPE).some(type => type === value);
}

export function toSwapCardType(value: unknown): SwapCardType {
  return isSwapCardType(value) ? value : SWAP_CARD_TYPE.SWAP;
}

export type OrderListTab = "active" | "past";

export type OrderKind = "dca" | "limit";

/** One row of the order history table, shared by DCA executions and limit fills. */
export interface OrderHistoryModel {
  key: string;
  txHash: string;
  /** Unix seconds. */
  time: number;
  /** Output per input, in display units. Null when nothing was sold. */
  rate: string | null;
  /** Display amount of the input token. */
  soldAmount: string;
  /** Display amount of the output token. */
  purchasedAmount: string;
}
