export type DcaOrderStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

/** A DCA order as returned by the list and detail endpoints. Amounts are raw integer strings. */
export interface DcaOrderItem {
  orderId: string;
  /**
   * Proxy realm path of the DCA contract that holds the order. Order IDs
   * restart when the realm is redeployed, so an order is identified by both.
   * Absent from order-api versions before realm-scoped orders.
   */
  packagePath?: string;
  owner: string;
  status: DcaOrderStatus;
  inputToken: string;
  outputToken: string;
  interval: number;
  slotOffset: number;
  groupId: string;
  amountPerExecution: string;
  executionCount: number;
  depositAmount: string;
  executedCount: number;
  remainingCount: number;
  soldAmount: string;
  purchasedAmount: string;
  remainingAmount: string;
  claimedAmount: string;
  claimableAmount: string;
  /** Unix seconds. Only set while the order is active. */
  nextExecutionAt: number | null;
  createdAt: number;
  createdTxHash: string;
  closedAt: number | null;
  closedTxHash: string | null;
  refundedAmount: string;
  /**
   * Output of swapping the whole deposit at once when the order was placed.
   * Null when the realm did not quote it; absent from order-api versions
   * before the return.
   */
  referenceAmountOut?: string | null;
  /** The one-off swap's output for the input sold so far (raw). Null before the first round. */
  referencePurchasedAmount?: string | null;
  /** Return of the fills against the one-off swap, in percent, e.g. `"1.2345"`. */
  returnRate?: string | null;
}

/** One executed round of a DCA order. Amounts are raw integer strings. */
export interface DcaExecutionItem {
  round: number;
  /** Unix seconds. */
  executedAt: number;
  txHash: string;
  soldAmount: string;
  purchasedAmount: string;
  poolPath: string;
  /** The one-off swap's output for one round's input (raw). */
  referencePurchasedAmount?: string | null;
  /** Return of the round against the one-off swap, in percent. */
  returnRate?: string | null;
}
