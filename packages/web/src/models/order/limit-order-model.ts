import { LimitOrderStatus } from "@repositories/order/response";
import { TokenModel } from "@models/token/token-model";

/** Expiry options offered by the limit form, in seconds. */
export const LIMIT_EXPIRY_OPTIONS = [
  { key: "oneHour", duration: 3_600 },
  { key: "oneDay", duration: 86_400 },
  { key: "oneWeek", duration: 604_800 },
  { key: "thirtyDays", duration: 2_592_000 },
] as const;

export type LimitExpiryKey = (typeof LIMIT_EXPIRY_OPTIONS)[number]["key"];

export const DEFAULT_LIMIT_EXPIRY = 86_400;

export const ACTIVE_LIMIT_ORDER_STATUSES: LimitOrderStatus[] = ["OPEN", "PARTIALLY_FILLED"];

/** A limit order with token decimals applied. Amounts are decimal strings in display units. */
export interface LimitOrderModel {
  orderId: string;
  /** Proxy realm path of the Limit contract that holds the order. */
  packagePath: string;
  /** Whether the order lives in the Limit realm this app places orders in; see DcaOrderModel. */
  isCurrentRealm: boolean;
  status: LimitOrderStatus;
  isActive: boolean;
  tokenIn: TokenModel;
  tokenOut: TokenModel;
  makingAmount: string;
  takingAmount: string;
  /** Slippage saved with this order, in basis points. */
  slippageBps: number;
  /** Owner-net minimum for the full original order, in display units; unchanged by fills or closure. */
  minimumReceived: string;
  /**
   * Owner-net minimum for the input still unfilled, in display units. Worked out from the order's raw terms and
   * rounded up, so it is not `minimumReceived` scaled by a ratio. Zero when nothing remains.
   */
  minimumRemainingReceived: string;
  /** Execution fee saved with this order, in basis points. */
  executionFeeRate: number;
  /**
   * Execution fee actually charged so far, in output-token display units. Null when the order-api does not report
   * it, so an unknown fee is never shown as zero.
   */
  cumulativeExecutionFee: string | null;
  filledInput: string;
  remainingInput: string;
  refundedInput: string;
  userOutput: string;
  /**
   * True while input is still escrowed in the realm. An EXPIRED order keeps
   * its input until a cleanup or the owner's CancelOrder refunds it, so this,
   * not the status, decides whether the cancel/refund action is offered.
   */
  canCancel: boolean;
  /** Output per input the order asks for. */
  limitPrice: string | null;
  /** Average output per input actually received. Null until a fill. */
  priceRate: string | null;
  /** Filled share of the order, 0 to 100. */
  progress: number;
  /** Unix seconds. */
  createdAt: number;
  expiresAt: number;
  closedAt: number | null;
  createdTxHash: string;
  closedTxHash: string | null;
}
