export type DcaOrderStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

/** A DCA order as returned by the list and detail endpoints. Amounts are raw integer strings. */
export interface DcaOrderItem {
  orderId: string;
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
}
