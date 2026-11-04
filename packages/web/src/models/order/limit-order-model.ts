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
  /** Whether the order lives in the Limit realm this app sends transactions to; see DcaOrderModel. */
  isCurrentRealm: boolean;
  status: LimitOrderStatus;
  isActive: boolean;
  tokenIn: TokenModel;
  tokenOut: TokenModel;
  makingAmount: string;
  takingAmount: string;
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
