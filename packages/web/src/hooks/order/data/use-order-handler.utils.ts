import BigNumber from "bignumber.js";

import { DCA_INTERVAL_UNITS, DcaIntervalUnit } from "@models/order/dca-order-model";
import { LIMIT_EXPIRY_OPTIONS, LimitExpiryKey } from "@models/order/limit-order-model";
import { TokenModel } from "@models/token/token-model";

/** Smallest order the UI accepts, per DCA execution or per limit order, in USD. */
export const DEFAULT_MIN_ORDER_USD = 50;
export const MIN_DCA_EXECUTION_COUNT = 2;
export const DEFAULT_DCA_EXECUTION_COUNT = MIN_DCA_EXECUTION_COUNT;
export const DEFAULT_MAX_DCA_EXECUTION_COUNT = 1000;
export const MAX_LIMIT_SLIPPAGE_BPS = 1000;
/** `−`/`+` on the limit price moves it by 0.1%. */
export const LIMIT_PRICE_STEP_RATE = 0.001;
export const LIMIT_PRICE_PRESETS = [1, 5, 10] as const;
const LIMIT_PRICE_SIGNIFICANT_DIGITS = 6;

/**
 * Button states of the order forms, in the priority they are checked.
 * Every state before `PLACE_ORDER` disables the button, except the first two
 * which act on the wallet.
 */
export type OrderButtonState =
  | "WALLET_LOGIN"
  | "SWITCH_NETWORK"
  | "ORDER_PAUSED"
  | "SELECT_TOKEN"
  | "ENTER_AMOUNT"
  | "INSUFFICIENT_BALANCE"
  | "INSUFFICIENT_LIQUIDITY"
  | "AMOUNT_TOO_LOW"
  | "PLACE_ORDER";

export interface OrderButtonStateParams {
  connected: boolean;
  isSwitchNetwork: boolean;
  isPaused: boolean;
  hasTokens: boolean;
  /** Sell amount in display units, as typed. */
  amount: string;
  /** Sell token balance in display units. `-` or empty when unknown. */
  balance: string;
  hasLiquidity: boolean;
  isAmountTooLow: boolean;
}

export function getOrderButtonState({
  connected,
  isSwitchNetwork,
  isPaused,
  hasTokens,
  amount,
  balance,
  hasLiquidity,
  isAmountTooLow,
}: OrderButtonStateParams): OrderButtonState {
  if (!connected) return "WALLET_LOGIN";
  if (isSwitchNetwork) return "SWITCH_NETWORK";
  if (isPaused) return "ORDER_PAUSED";
  if (!hasTokens) return "SELECT_TOKEN";

  const amountBN = BigNumber(amount || 0);
  if (!amountBN.isFinite() || amountBN.isLessThanOrEqualTo(0)) return "ENTER_AMOUNT";

  const balanceBN = BigNumber(`${balance}`.replace(/,/g, ""));
  if (!balanceBN.isFinite() || amountBN.isGreaterThan(balanceBN)) return "INSUFFICIENT_BALANCE";

  if (!hasLiquidity) return "INSUFFICIENT_LIQUIDITY";
  if (isAmountTooLow) return "AMOUNT_TOO_LOW";

  return "PLACE_ORDER";
}

export function isOrderButtonActionable(state: OrderButtonState) {
  return state === "WALLET_LOGIN" || state === "SWITCH_NETWORK" || state === "PLACE_ORDER";
}

/** USD value of a display amount, or null when the price is unknown. */
export function calculateUsdValue(amount: string, usdPrice: BigNumber.Value | null | undefined): number | null {
  if (usdPrice === null || usdPrice === undefined || usdPrice === "") return null;
  const value = BigNumber(amount || 0).multipliedBy(usdPrice);
  return value.isFinite() ? value.toNumber() : null;
}

/**
 * The largest `Over` value: every execution must be worth at least the minimum
 * order, and the contract caps the count. `min(maxExecutionCount, floor(sellUsd / 50))`.
 */
export function calculateMaxExecutionCount(
  sellUsd: number | null,
  maxExecutionCount = DEFAULT_MAX_DCA_EXECUTION_COUNT,
  minOrderUsd = DEFAULT_MIN_ORDER_USD,
): number {
  if (sellUsd === null || !Number.isFinite(sellUsd) || minOrderUsd <= 0) return maxExecutionCount;
  return Math.min(maxExecutionCount, Math.floor(sellUsd / minOrderUsd));
}

/** Clamps an `Over` value into `[2, max]`. A max below 2 still allows 2 so the form can say why. */
export function clampExecutionCount(count: number, maxExecutionCount: number): number {
  if (!Number.isFinite(count)) return MIN_DCA_EXECUTION_COUNT;
  const max = Math.max(MIN_DCA_EXECUTION_COUNT, maxExecutionCount);
  return Math.min(max, Math.max(MIN_DCA_EXECUTION_COUNT, Math.floor(count)));
}

/** Raw amount sold per execution: `floor(total / count)`. The remainder is never sent. */
export function calculateAmountPerExecution(rawTotalAmount: string, executionCount: number): string {
  if (!executionCount || executionCount <= 0) return "0";
  const total = BigNumber(rawTotalAmount || 0);
  if (!total.isFinite() || total.isLessThanOrEqualTo(0)) return "0";
  return total.dividedToIntegerBy(executionCount).toFixed(0);
}

/** A DCA order is too small when one execution is worth less than the minimum order. */
export function isDcaAmountTooLow(
  sellUsd: number | null,
  executionCount: number,
  minOrderUsd = DEFAULT_MIN_ORDER_USD,
): boolean {
  if (sellUsd === null || executionCount <= 0) return false;
  return sellUsd / executionCount < minOrderUsd;
}

export function isLimitAmountTooLow(sellUsd: number | null, minOrderUsd = DEFAULT_MIN_ORDER_USD): boolean {
  if (sellUsd === null) return false;
  return sellUsd < minOrderUsd;
}

/** The swap slippage setting (percent) as basis points, capped to what the limit realm accepts. */
export function toLimitSlippageBps(slippagePercent: number, maxSlippageBps = MAX_LIMIT_SLIPPAGE_BPS): number {
  if (!Number.isFinite(slippagePercent) || slippagePercent <= 0) return 0;
  return Math.min(maxSlippageBps, Math.round(slippagePercent * 100));
}

/** Raw output the owner must receive: `floor(making × limitPrice)` with both decimals applied. */
export function calculateTakingAmount(
  rawMakingAmount: string,
  limitPrice: string,
  tokenIn: Pick<TokenModel, "decimals">,
  tokenOut: Pick<TokenModel, "decimals">,
): string {
  const taking = BigNumber(rawMakingAmount || 0)
    .shiftedBy(-tokenIn.decimals)
    .multipliedBy(limitPrice || 0)
    .shiftedBy(tokenOut.decimals);
  if (!taking.isFinite() || taking.isLessThanOrEqualTo(0)) return "0";
  return taking.toFixed(0, BigNumber.ROUND_FLOOR);
}

/** Trims a price to a few significant digits for the limit price field. */
export function formatLimitPriceInput(price: BigNumber.Value): string {
  const value = BigNumber(price);
  if (!value.isFinite() || value.isLessThanOrEqualTo(0)) return "";
  return BigNumber(value.toPrecision(LIMIT_PRICE_SIGNIFICANT_DIGITS, BigNumber.ROUND_DOWN)).toFixed();
}

export function stepLimitPrice(price: string, direction: 1 | -1): string {
  const value = BigNumber(price || 0);
  if (!value.isFinite() || value.isLessThanOrEqualTo(0)) return price;
  return formatLimitPriceInput(value.multipliedBy(1 + direction * LIMIT_PRICE_STEP_RATE));
}

export function applyLimitPricePreset(marketPrice: string, percent: number): string {
  return formatLimitPriceInput(BigNumber(marketPrice || 0).multipliedBy(1 + percent / 100));
}

export function getAvailableDcaIntervals(
  allowedIntervals: { interval: number }[] | undefined,
): { unit: DcaIntervalUnit; interval: number }[] {
  if (!allowedIntervals) return DCA_INTERVAL_UNITS;
  const allowed = new Set(allowedIntervals.map(item => item.interval));
  return DCA_INTERVAL_UNITS.filter(item => allowed.has(item.interval));
}

export function getAvailableExpiryOptions(
  minDurationSec?: number,
  maxDurationSec?: number,
): { key: LimitExpiryKey; duration: number }[] {
  return LIMIT_EXPIRY_OPTIONS.filter(
    option =>
      (minDurationSec === undefined || option.duration >= minDurationSec) &&
      (maxDurationSec === undefined || option.duration <= maxDurationSec),
  );
}
