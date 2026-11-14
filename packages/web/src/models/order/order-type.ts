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

/**
 * The swap card modes this deployment offers. DCA and Limit are each enabled
 * only when their order realm path is configured; Swap is always available.
 */
export function getEnabledSwapCardTypes({
  dcaOrderPath,
  limitOrderPath,
}: {
  dcaOrderPath: string;
  limitOrderPath: string;
}): SwapCardType[] {
  return [
    SWAP_CARD_TYPE.SWAP,
    ...(dcaOrderPath ? [SWAP_CARD_TYPE.DCA] : []),
    ...(limitOrderPath ? [SWAP_CARD_TYPE.LIMIT] : []),
  ];
}

/** Like `toSwapCardType`, but a disabled mode falls back to Swap. */
export function toEnabledSwapCardType(value: unknown, enabledTypes: SwapCardType[]): SwapCardType {
  const type = toSwapCardType(value);
  return enabledTypes.includes(type) ? type : SWAP_CARD_TYPE.SWAP;
}

/** Whether any order mode is enabled; without one the swap page has no order UI at all. */
export function hasOrderSwapCardTypes(enabledTypes: SwapCardType[]): boolean {
  return enabledTypes.some(type => type !== SWAP_CARD_TYPE.SWAP);
}

export type OrderListTab = "active" | "past";

export type OrderKind = "dca" | "limit";

/** The asset being priced is sold from tokenIn, or bought into tokenOut. */
export type LimitOrderSide = "sell" | "buy";

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
  /**
   * Execution fee charged by this fill, in display units of the output token. Limit fills only; null when the
   * order-api does not report it.
   */
  executionFee?: string | null;
}
