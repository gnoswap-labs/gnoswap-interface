import { DcaOrderStatus } from "@repositories/order/response";
import { TokenModel } from "@models/token/token-model";

/** Allowed DCA intervals, in seconds. Month is fixed to 30 days by the contract. */
export const DCA_INTERVAL = {
  MINUTE: 60,
  HOUR: 3_600,
  DAY: 86_400,
  WEEK: 604_800,
  MONTH: 2_592_000,
} as const;

export type DcaIntervalUnit = "minute" | "hour" | "day" | "week" | "month";

export const DCA_INTERVAL_UNITS: { unit: DcaIntervalUnit; interval: number }[] = [
  { unit: "minute", interval: DCA_INTERVAL.MINUTE },
  { unit: "hour", interval: DCA_INTERVAL.HOUR },
  { unit: "day", interval: DCA_INTERVAL.DAY },
  { unit: "week", interval: DCA_INTERVAL.WEEK },
  { unit: "month", interval: DCA_INTERVAL.MONTH },
];

export function getDcaIntervalUnit(interval: number): DcaIntervalUnit | null {
  return DCA_INTERVAL_UNITS.find(item => item.interval === interval)?.unit ?? null;
}

/** A DCA order with token decimals applied. Amounts are decimal strings in display units. */
export interface DcaOrderModel {
  orderId: string;
  /** Proxy realm path of the DCA contract that holds the order. */
  packagePath: string;
  /**
   * Whether the order lives in the DCA realm this app places orders in.
   * An order of an earlier realm deployment is stopped or claimed in its own realm.
   */
  isCurrentRealm: boolean;
  status: DcaOrderStatus;
  isActive: boolean;
  inputToken: TokenModel;
  outputToken: TokenModel;
  /** Seconds between executions. */
  interval: number;
  executionCount: number;
  executedCount: number;
  remainingCount: number;
  /** Executed share of the order, 0 to 100. */
  progress: number;
  amountPerExecution: string;
  depositAmount: string;
  soldAmount: string;
  purchasedAmount: string;
  /** What a stop would refund. */
  remainingAmount: string;
  /** Output already paid to the owner. */
  claimedAmount: string;
  /** Output accrued but not yet paid to the owner. */
  claimableAmount: string;
  /**
   * True when every round executed but the output is still unpaid: the order
   * left the active list, yet the owner must Claim to receive the output and
   * finalize it on-chain.
   */
  canClaim: boolean;
  /** Average output per input. Null until something executed. */
  priceRate: string | null;
  /**
   * Return of the fills against swapping the whole deposit at once when the
   * order was placed, in percent. Null without a reference or before a round.
   */
  returnRate: number | null;
  /** Unix seconds. */
  nextExecutionAt: number | null;
  createdAt: number;
  closedAt: number | null;
  createdTxHash: string;
  closedTxHash: string | null;
}
