export type LimitOrderStatus = "OPEN" | "PARTIALLY_FILLED" | "COMPLETED" | "CANCELLED" | "EXPIRED";

/** A limit order as returned by the list and detail endpoints. Amounts are raw integer strings. */
export interface LimitOrderItem {
  orderId: string;
  /** Proxy realm path of the Limit contract that holds the order; see DcaOrderItem.packagePath. */
  packagePath?: string;
  owner: string;
  status: LimitOrderStatus;
  tokenIn: string;
  tokenOut: string;
  /** Canonical token path selected at creation; absent for legacy orders. */
  baseToken?: string | null;
  makingAmount: string;
  takingAmount: string;
  slippageBps: number;
  executionFeeRate: number;
  /**
   * Execution fee charged so far, summed over the order's fills, in output-token raw units. Absent from an
   * order-api that predates it, which is not the same as a fee of "0".
   */
  cumulativeExecutionFee?: string;
  filledInput: string;
  remainingInput: string;
  refundedInput: string;
  userOutput: string;
  /** Unix seconds. */
  createdAt: number;
  expiresAt: number;
  createdTxHash: string;
  closedAt: number | null;
  closedTxHash: string | null;
}

/** One fill of a limit order. Amounts are raw integer strings. */
export interface LimitFillItem {
  txHash: string;
  amountIn: string;
  userOutput: string;
  executionFee: string;
  /** Unix seconds. */
  blockTime: number;
}
