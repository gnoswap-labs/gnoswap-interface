import BigNumber from "bignumber.js";

import { GNOT_TOKEN } from "@common/values/token-constant";
import { PACKAGE_DCA_ORDER_PATH, PACKAGE_LIMIT_ORDER_PATH } from "@constants/environment.constant";
import { TokenModel } from "@models/token/token-model";
import { DcaExecutionItem, DcaOrderItem, LimitFillItem, LimitOrderItem } from "@repositories/order/response";
import { isGNOTPath } from "@utils/common";
import { makeDisplayTokenAmountString } from "@utils/token-utils";

import { DcaOrderModel } from "../dca-order-model";
import { ACTIVE_LIMIT_ORDER_STATUSES, LimitOrderModel } from "../limit-order-model";
import { OrderHistoryModel } from "../order-type";

/** Decimals assumed for a token the token list does not know yet. GRC20 tokens on Gno default to 6. */
const UNKNOWN_TOKEN_DECIMALS = 6;

/**
 * Finds the token for a realm path the order API returned. The order realms
 * only hold wrapped GNOT, which is shown as GNOT like everywhere else.
 */
export function resolveOrderToken(path: string, tokens: TokenModel[]): TokenModel {
  if (isGNOTPath(path)) {
    return tokens.find(token => token.path === GNOT_TOKEN.path) ?? GNOT_TOKEN;
  }

  const token = tokens.find(token => token.path === path);
  if (token) return token;

  const symbol = path.split("/").pop()?.toUpperCase() || path;
  return {
    type: "GRC20",
    chainId: "",
    createdAt: "",
    name: symbol,
    path,
    decimals: UNKNOWN_TOKEN_DECIMALS,
    symbol,
    displaySymbol: symbol,
    logoURI: "",
    priceID: path,
  };
}

export function toDisplayAmount(token: Pick<TokenModel, "decimals">, rawAmount: string | null | undefined): string {
  return makeDisplayTokenAmountString(token, rawAmount) ?? "0";
}

/** Output per input in display units, so `1 input = rate output`. Null when nothing was sold. */
export function calculatePriceRate(
  inputToken: Pick<TokenModel, "decimals">,
  outputToken: Pick<TokenModel, "decimals">,
  rawInput: string | null | undefined,
  rawOutput: string | null | undefined,
): string | null {
  const input = BigNumber(rawInput ?? 0).shiftedBy(-inputToken.decimals);
  const output = BigNumber(rawOutput ?? 0).shiftedBy(-outputToken.decimals);
  if (!input.isFinite() || !output.isFinite() || input.isLessThanOrEqualTo(0)) {
    return null;
  }

  return output.dividedBy(input).toFixed();
}

/** `part / total` as a percentage clamped to 0-100. */
export function calculateProgress(part: BigNumber.Value, total: BigNumber.Value): number {
  const totalBN = BigNumber(total);
  if (!totalBN.isFinite() || totalBN.isLessThanOrEqualTo(0)) return 0;

  const progress = BigNumber(part).dividedBy(totalBN).multipliedBy(100).toNumber();
  if (!Number.isFinite(progress)) return 0;
  return Math.min(100, Math.max(0, progress));
}

/** A return rate from the order-api as a number. Null when absent or not a number. */
export function parseReturnRate(rate: string | null | undefined): number | null {
  if (rate === null || rate === undefined || rate === "") return null;
  const value = Number(rate);
  return Number.isFinite(value) ? value : null;
}

/**
 * The realm of an order: the one the order-api reports, or the current realm
 * for an order-api from before realm-scoped orders.
 */
export function resolveOrderRealm(packagePath: string | undefined, currentPackagePath: string) {
  const realm = packagePath || currentPackagePath;
  return { packagePath: realm, isCurrentRealm: realm === currentPackagePath };
}

export function mapDcaOrderItemToModel(item: DcaOrderItem, tokens: TokenModel[]): DcaOrderModel {
  const inputToken = resolveOrderToken(item.inputToken, tokens);
  const outputToken = resolveOrderToken(item.outputToken, tokens);
  const isActive = item.status === "ACTIVE";
  const realm = resolveOrderRealm(item.packagePath, PACKAGE_DCA_ORDER_PATH);

  return {
    orderId: item.orderId,
    ...realm,
    status: item.status,
    isActive,
    inputToken,
    outputToken,
    interval: item.interval,
    executionCount: item.executionCount,
    executedCount: item.executedCount,
    remainingCount: isActive ? item.remainingCount : 0,
    // Completed orders are full; cancelled ones keep the share they reached.
    progress: item.status === "COMPLETED" ? 100 : calculateProgress(item.executedCount, item.executionCount),
    amountPerExecution: toDisplayAmount(inputToken, item.amountPerExecution),
    depositAmount: toDisplayAmount(inputToken, item.depositAmount),
    soldAmount: toDisplayAmount(inputToken, item.soldAmount),
    purchasedAmount: toDisplayAmount(outputToken, item.purchasedAmount),
    remainingAmount: toDisplayAmount(inputToken, item.remainingAmount),
    claimedAmount: toDisplayAmount(outputToken, item.claimedAmount),
    claimableAmount: toDisplayAmount(outputToken, item.claimableAmount),
    // Claimed in the order's own realm, an earlier deployment included.
    canClaim: item.status === "COMPLETED" && BigNumber(item.claimableAmount ?? 0).isGreaterThan(0),
    forceCancelled: item.status === "CANCELLED" && !!item.forceCancelled,
    priceRate: calculatePriceRate(inputToken, outputToken, item.soldAmount, item.purchasedAmount),
    returnRate: parseReturnRate(item.returnRate),
    nextExecutionAt: isActive ? item.nextExecutionAt : null,
    createdAt: item.createdAt,
    closedAt: item.closedAt,
    createdTxHash: item.createdTxHash,
    closedTxHash: item.closedTxHash,
  };
}

/**
 * Whether the owner can still get the escrowed input back with CancelOrder.
 * The realm accepts it while the order has remaining input, including after
 * expiry until the order is cleaned up (cleanup sets refundedInput).
 */
export function canCancelLimitOrder(
  item: Pick<LimitOrderItem, "status" | "remainingInput" | "refundedInput">,
): boolean {
  if (!BigNumber(item.remainingInput ?? 0).isGreaterThan(0)) return false;
  if (ACTIVE_LIMIT_ORDER_STATUSES.includes(item.status)) return true;
  return item.status === "EXPIRED" && BigNumber(item.refundedInput ?? 0).isLessThanOrEqualTo(0);
}

export function mapLimitOrderItemToModel(item: LimitOrderItem, tokens: TokenModel[]): LimitOrderModel {
  const tokenIn = resolveOrderToken(item.tokenIn, tokens);
  const tokenOut = resolveOrderToken(item.tokenOut, tokens);
  const realm = resolveOrderRealm(item.packagePath, PACKAGE_LIMIT_ORDER_PATH);

  return {
    orderId: item.orderId,
    ...realm,
    status: item.status,
    isActive: ACTIVE_LIMIT_ORDER_STATUSES.includes(item.status),
    tokenIn,
    tokenOut,
    makingAmount: toDisplayAmount(tokenIn, item.makingAmount),
    takingAmount: toDisplayAmount(tokenOut, item.takingAmount),
    filledInput: toDisplayAmount(tokenIn, item.filledInput),
    remainingInput: toDisplayAmount(tokenIn, item.remainingInput),
    refundedInput: toDisplayAmount(tokenIn, item.refundedInput),
    userOutput: toDisplayAmount(tokenOut, item.userOutput),
    // Cancelled in the order's own realm, so an earlier realm's order can still be cancelled.
    canCancel: canCancelLimitOrder(item),
    limitPrice: calculatePriceRate(tokenIn, tokenOut, item.makingAmount, item.takingAmount),
    priceRate: calculatePriceRate(tokenIn, tokenOut, item.filledInput, item.userOutput),
    progress: item.status === "COMPLETED" ? 100 : calculateProgress(item.filledInput, item.makingAmount),
    createdAt: item.createdAt,
    expiresAt: item.expiresAt,
    closedAt: item.closedAt,
    createdTxHash: item.createdTxHash,
    closedTxHash: item.closedTxHash,
  };
}

export function mapDcaExecutionToHistory(
  item: DcaExecutionItem,
  inputToken: TokenModel,
  outputToken: TokenModel,
): OrderHistoryModel {
  return {
    key: `${item.round}-${item.txHash}`,
    txHash: item.txHash,
    time: item.executedAt,
    rate: calculatePriceRate(inputToken, outputToken, item.soldAmount, item.purchasedAmount),
    soldAmount: toDisplayAmount(inputToken, item.soldAmount),
    purchasedAmount: toDisplayAmount(outputToken, item.purchasedAmount),
  };
}

export function mapLimitFillToHistory(
  item: LimitFillItem,
  tokenIn: TokenModel,
  tokenOut: TokenModel,
  index: number,
): OrderHistoryModel {
  return {
    key: `${item.txHash}-${index}`,
    txHash: item.txHash,
    time: item.blockTime,
    rate: calculatePriceRate(tokenIn, tokenOut, item.amountIn, item.userOutput),
    soldAmount: toDisplayAmount(tokenIn, item.amountIn),
    purchasedAmount: toDisplayAmount(tokenOut, item.userOutput),
  };
}
