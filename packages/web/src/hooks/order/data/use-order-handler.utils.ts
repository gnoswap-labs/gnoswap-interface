import BigNumber from "bignumber.js";

import { DCA_INTERVAL_UNITS, DcaIntervalUnit } from "@models/order/dca-order-model";
import { LIMIT_EXPIRY_OPTIONS, LimitExpiryKey } from "@models/order/limit-order-model";
import { TokenModel } from "@models/token/token-model";

/**
 * The realms' v0 minimums in raw input units, used until their config loads:
 * DCA `minAmountPerExecution` and Limit `minMakingAmount`.
 */
export const DEFAULT_MIN_AMOUNT_PER_EXECUTION = "1";
export const DEFAULT_MIN_MAKING_AMOUNT = "100";
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
  | "NO_DIRECT_POOL"
  | "POOL_CHECK_FAILED"
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
  /**
   * False when the pair has no pool of its own. The DCA realm swaps each round
   * in one of the pair's pools and rejects CreateOrder without one, so a
   * multi-hop router quote is not enough. Omitted for orders that route freely.
   */
  hasDirectPool?: boolean;
  /**
   * True when the pool list failed to load and no cached list can tell whether
   * the pair has a pool. The order stays blocked (the realm would reject it) and
   * the button retries the check.
   */
  isPoolCheckFailed?: boolean;
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
  hasDirectPool = true,
  isPoolCheckFailed = false,
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
  if (isPoolCheckFailed) return "POOL_CHECK_FAILED";
  if (!hasDirectPool) return "NO_DIRECT_POOL";
  if (isAmountTooLow) return "AMOUNT_TOO_LOW";

  return "PLACE_ORDER";
}

export function isOrderButtonActionable(state: OrderButtonState) {
  return (
    state === "WALLET_LOGIN" || state === "SWITCH_NETWORK" || state === "POOL_CHECK_FAILED" || state === "PLACE_ORDER"
  );
}

/**
 * Whether a pool exists for exactly this pair, at any fee tier: the DCA realm's
 * `getCandidatePools(inputToken, outputToken)`. Paths are the realm (wrapped)
 * paths; a pool path is `token0:token1:fee` with the tokens sorted.
 */
export function hasDirectPoolForPair(
  pools: { poolPath?: string | null }[],
  inputTokenPath: string,
  outputTokenPath: string,
): boolean {
  if (!inputTokenPath || !outputTokenPath || inputTokenPath === outputTokenPath) return false;
  return pools.some(pool => {
    const [token0, token1] = (pool.poolPath ?? "").split(":");
    return (
      (token0 === inputTokenPath && token1 === outputTokenPath) ||
      (token0 === outputTokenPath && token1 === inputTokenPath)
    );
  });
}

/** USD value of a display amount, or null when the price is unknown. */
export function calculateUsdValue(amount: string, usdPrice: BigNumber.Value | null | undefined): number | null {
  if (usdPrice === null || usdPrice === undefined || usdPrice === "") return null;
  const value = BigNumber(amount || 0).multipliedBy(usdPrice);
  return value.isFinite() ? value.toNumber() : null;
}

/**
 * The largest `Over` value the DCA realm accepts: each execution must sell at
 * least `minAmountPerExecution` raw units, and the count is capped by
 * `maxExecutionCount`. `min(maxExecutionCount, floor(sellRaw / minAmountPerExecution))`.
 */
export function calculateMaxExecutionCount(
  rawSellAmount: string,
  maxExecutionCount = DEFAULT_MAX_DCA_EXECUTION_COUNT,
  minAmountPerExecution = DEFAULT_MIN_AMOUNT_PER_EXECUTION,
): number {
  const sell = BigNumber(rawSellAmount || 0);
  const min = BigNumber(minAmountPerExecution);
  if (!sell.isFinite() || sell.isLessThanOrEqualTo(0) || !min.isFinite() || min.isLessThanOrEqualTo(0)) {
    return maxExecutionCount;
  }
  return BigNumber.min(maxExecutionCount, sell.dividedToIntegerBy(min)).toNumber();
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

/**
 * Native GNOT is wrapped before it is escrowed, and the wrap needs at least
 * `minDepositAmount` raw units (MIN_GNOT_DEPOSIT_AMOUNT). For a native input
 * the limit realm's `minMakingAmount` is raised to that minimum.
 */
export function getLimitMinMakingAmount(
  minMakingAmount: string,
  isNativeInput: boolean,
  minDepositAmount: BigNumber.Value,
): string {
  if (!isNativeInput) return minMakingAmount;
  return BigNumber.max(minMakingAmount, minDepositAmount).toFixed(0);
}

/**
 * The DCA deposit is `amountPerExecution × executionCount`. For a native input
 * it must reach the wrap minimum, so each execution has to sell at least
 * `ceil(minDepositAmount / executionCount)` raw units, or the realm minimum if higher.
 */
export function getDcaMinAmountPerExecution(
  minAmountPerExecution: string,
  isNativeInput: boolean,
  executionCount: number,
  minDepositAmount: BigNumber.Value,
): string {
  if (!isNativeInput || !executionCount || executionCount <= 0) return minAmountPerExecution;
  const wrapMinimum = BigNumber(minDepositAmount).dividedBy(executionCount).integerValue(BigNumber.ROUND_CEIL);
  return BigNumber.max(minAmountPerExecution, wrapMinimum).toFixed(0);
}

/** A DCA order is too small when one execution sells less than the realm's `minAmountPerExecution`. */
export function isDcaAmountTooLow(
  rawAmountPerExecution: string,
  minAmountPerExecution = DEFAULT_MIN_AMOUNT_PER_EXECUTION,
): boolean {
  return BigNumber(rawAmountPerExecution || 0).isLessThan(minAmountPerExecution);
}

/**
 * A limit order is too small when it escrows less than the realm's `minMakingAmount`,
 * or when its target output rounds down to zero (the realm requires a positive `takingAmount`).
 */
export function isLimitAmountTooLow(
  rawMakingAmount: string,
  rawTakingAmount: string,
  minMakingAmount = DEFAULT_MIN_MAKING_AMOUNT,
): boolean {
  return (
    BigNumber(rawMakingAmount || 0).isLessThan(minMakingAmount) ||
    BigNumber(rawTakingAmount || 0).isLessThanOrEqualTo(0)
  );
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
