import { SwapRouteRequest } from "@repositories/swap-router/request/swap-route-request";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";

import { toShiftBitInt } from "./number-utils";
import { calculateSlippageLimitAmount, getDepositAmountsByAmountA, getDepositAmountsByAmountB } from "./swap-utils";
import { makeDisplayTokenAmountString } from "./token-utils";

const DEPOSIT_AMOUNT_10_POW_8 = 100_000_000n;

/** Decimal-string pair of token amounts. Amounts stay strings so values above 2^53 raw units are exact. */
export interface RepositionAmounts {
  amountA: string;
  amountB: string;
}

/** Converts a raw (integer) amount to its display amount as a decimal string. */
function rawToDisplayString(amount: bigint | number | string, decimals: number): string {
  return BigNumber(amount.toString()).shiftedBy(-decimals).toFixed();
}

export function getRepositionAmountsByPriceRange(
  currentPrice: number,
  sqrtPriceX96: bigint,
  repositionMinPrice: number,
  repositionMaxPrice: number,
  originMinPrice: number,
  originMaxPrice: number,
  originToken0Balance: string,
  originToken1Balance: string,
): RepositionAmounts {
  const originDepositAmounts =
    currentPrice <= originMaxPrice
      ? getDepositAmountsByAmountA(currentPrice, sqrtPriceX96, originMinPrice, originMaxPrice, DEPOSIT_AMOUNT_10_POW_8)
      : getDepositAmountsByAmountB(currentPrice, sqrtPriceX96, originMinPrice, originMaxPrice, DEPOSIT_AMOUNT_10_POW_8);

  const newDepositAmounts =
    currentPrice <= repositionMaxPrice
      ? getDepositAmountsByAmountA(
          currentPrice,
          sqrtPriceX96,
          repositionMinPrice,
          repositionMaxPrice,
          DEPOSIT_AMOUNT_10_POW_8,
        )
      : getDepositAmountsByAmountB(
          currentPrice,
          sqrtPriceX96,
          repositionMinPrice,
          repositionMaxPrice,
          DEPOSIT_AMOUNT_10_POW_8,
        );

  const originAmountA = BigNumber(originDepositAmounts.amountA.toString());
  const originAmountB = BigNumber(originDepositAmounts.amountB.toString());
  const newAmountA = BigNumber(newDepositAmounts.amountA.toString());
  const newAmountB = BigNumber(newDepositAmounts.amountB.toString());

  const originDepositRatioBN = originAmountA.dividedBy(originAmountA.plus(originAmountB));
  const newDepositRatioBN = newAmountA.dividedBy(newAmountA.plus(newAmountB));

  const amountARatioBN = newDepositRatioBN.dividedBy(originDepositRatioBN);
  const amountBRatioBN = BigNumber(1).minus(newDepositRatioBN).dividedBy(BigNumber(1).minus(originDepositRatioBN));

  if (originDepositRatioBN.isEqualTo(0)) {
    const amountBBN = BigNumber(originToken1Balance).multipliedBy(amountBRatioBN);
    const amountABN = amountBBN.multipliedBy(newAmountA).div(newAmountB);

    return {
      amountA: newAmountB.isZero() ? "Infinity" : amountABN.decimalPlaces(6).toFixed(),
      amountB: amountBBN.decimalPlaces(6).toFixed(),
    };
  }
  if (originDepositRatioBN.isEqualTo(1)) {
    const amountABN = BigNumber(originToken0Balance).multipliedBy(amountARatioBN);
    const amountBBN = amountABN.multipliedBy(newAmountB).div(newAmountA);

    return {
      amountA: amountABN.decimalPlaces(6).toFixed(),
      amountB: newAmountA.isZero() ? "Infinity" : amountBBN.decimalPlaces(6).toFixed(),
    };
  }

  return {
    amountA: BigNumber(originToken0Balance).multipliedBy(amountARatioBN).toFixed(),
    amountB: BigNumber(originToken1Balance).multipliedBy(amountBRatioBN).toFixed(),
  };
}

export function getRepositionAmountsWithSwapSimulation(
  currentPrice: number,
  sqrtPriceX96: bigint,
  repositionMinPrice: number,
  repositionMaxPrice: number,
  tokenA: TokenModel,
  tokenB: TokenModel,
  currentAmounts: RepositionAmounts,
  initialEstimatedRepositionAmounts: RepositionAmounts,
  swapInputToken: TokenModel,
  swapOutputAmount: string,
): RepositionAmounts {
  const { amountA, amountB } = currentAmounts;
  const { amountA: repositionAmountA, amountB: repositionAmountB } = initialEstimatedRepositionAmounts;

  const isSwapAtoB = swapInputToken === tokenA;

  if (isSwapAtoB) {
    const estimatedAmountA = BigNumber(repositionAmountA);
    const estimatedAmountB = BigNumber(makeDisplayTokenAmountString(tokenB, swapOutputAmount) ?? "0").plus(amountB);

    if (estimatedAmountA.isZero()) {
      return {
        amountA: estimatedAmountA.toFixed(),
        amountB: estimatedAmountB.toFixed(),
      };
    }

    const isInsufficientQuantity = BigNumber(repositionAmountB).isGreaterThan(estimatedAmountB);

    if (isInsufficientQuantity) {
      const depositAmounts = getDepositAmountsByAmountB(
        currentPrice,
        sqrtPriceX96,
        repositionMinPrice || 1,
        repositionMaxPrice || 1,
        toShiftBitInt(estimatedAmountB.toFixed(), tokenB.decimals),
      );
      return {
        amountA: rawToDisplayString(depositAmounts.amountA, tokenA.decimals),
        amountB: rawToDisplayString(depositAmounts.amountB, tokenB.decimals),
      };
    }

    const depositAmounts = getDepositAmountsByAmountA(
      currentPrice,
      sqrtPriceX96,
      repositionMinPrice || 1,
      repositionMaxPrice || 1,
      toShiftBitInt(estimatedAmountA.toFixed(), tokenA.decimals),
    );
    return {
      amountA: rawToDisplayString(depositAmounts.amountA, tokenA.decimals),
      amountB: rawToDisplayString(depositAmounts.amountB, tokenB.decimals),
    };
  }

  const estimatedAmountA = BigNumber(makeDisplayTokenAmountString(tokenA, swapOutputAmount) ?? "0").plus(amountA);
  const estimatedAmountB = BigNumber(repositionAmountB);

  if (estimatedAmountB.isZero()) {
    return {
      amountA: estimatedAmountA.toFixed(),
      amountB: estimatedAmountB.toFixed(),
    };
  }

  const isInsufficientQuantity = BigNumber(repositionAmountA).isGreaterThan(estimatedAmountA);

  if (isInsufficientQuantity) {
    const depositAmounts = getDepositAmountsByAmountA(
      currentPrice,
      sqrtPriceX96,
      repositionMinPrice || 1,
      repositionMaxPrice || 1,
      toShiftBitInt(estimatedAmountA.toFixed(), tokenA.decimals),
    );
    return {
      amountA: rawToDisplayString(depositAmounts.amountA, tokenA.decimals),
      amountB: rawToDisplayString(depositAmounts.amountB, tokenB.decimals),
    };
  }

  const depositAmounts = getDepositAmountsByAmountB(
    currentPrice,
    sqrtPriceX96,
    repositionMinPrice || 1,
    repositionMaxPrice || 1,
    toShiftBitInt(estimatedAmountB.toFixed(), tokenB.decimals),
  );

  return {
    amountA: rawToDisplayString(depositAmounts.amountA, tokenA.decimals),
    amountB: rawToDisplayString(depositAmounts.amountB, tokenB.decimals),
  };
}

export interface RepositionSwapEstimateRequest {
  inputToken: TokenModel;
  outputToken: TokenModel;
  /** Decimal string; null when there is nothing to swap. */
  tokenAmount: string | null;
  exactType: "EXACT_IN";
}

/**
 * Builds the route lookup request for the remainder that must be swapped to reach the
 * new position ratio. Amounts are decimal strings; a zero or invalid remainder is `null`.
 */
export function makeRepositionSwapEstimateRequest(
  tokenA: TokenModel,
  tokenB: TokenModel,
  currentAmounts: RepositionAmounts,
  initialEstimatedRepositionAmounts: RepositionAmounts,
): RepositionSwapEstimateRequest {
  const { amountA, amountB } = currentAmounts;
  const { amountA: repositionAmountA, amountB: repositionAmountB } = initialEstimatedRepositionAmounts;

  const toRequestAmount = (amount: BigNumber) => (amount.isFinite() && !amount.isZero() ? amount.toFixed() : null);

  const isSwapAtoB = BigNumber(amountA).isGreaterThan(repositionAmountA);
  if (isSwapAtoB) {
    return {
      inputToken: tokenA,
      outputToken: tokenB,
      tokenAmount: toRequestAmount(BigNumber(amountA).minus(repositionAmountA)),
      exactType: "EXACT_IN",
    };
  }
  return {
    inputToken: tokenB,
    outputToken: tokenA,
    tokenAmount: toRequestAmount(BigNumber(amountB).minus(repositionAmountB)),
    exactType: "EXACT_IN",
  };
}

/**
 * Computes the swap amount and slippage limit for the reposition swap as decimal strings.
 * EXACT_IN: input = current - target, limit = minimum output (rounded down).
 * EXACT_OUT: output = target - current, limit = maximum input (rounded up).
 */
export function makeRepositionSwapAmounts(
  estimateRequest: Pick<RepositionSwapEstimateRequest, "inputToken" | "outputToken"> & {
    exactType: "EXACT_IN" | "EXACT_OUT";
  },
  isSwapAtoB: boolean,
  currentAmounts: RepositionAmounts,
  estimatedRepositionAmounts: RepositionAmounts,
  slippage: number,
): Pick<SwapRouteRequest, "tokenAmount" | "tokenAmountLimit"> {
  const isExactIn = estimateRequest.exactType === "EXACT_IN";

  const inputAmount = isSwapAtoB
    ? BigNumber(currentAmounts.amountA).minus(estimatedRepositionAmounts.amountA)
    : BigNumber(currentAmounts.amountB).minus(estimatedRepositionAmounts.amountB);

  const outputAmount = isSwapAtoB
    ? BigNumber(estimatedRepositionAmounts.amountB).minus(currentAmounts.amountB)
    : BigNumber(estimatedRepositionAmounts.amountA).minus(currentAmounts.amountA);

  return {
    tokenAmount: isExactIn ? inputAmount.toFixed() : outputAmount.toFixed(),
    tokenAmountLimit: isExactIn
      ? calculateSlippageLimitAmount(outputAmount.toFixed(), slippage, "EXACT_IN", estimateRequest.outputToken.decimals)
      : calculateSlippageLimitAmount(inputAmount.toFixed(), slippage, "EXACT_OUT", estimateRequest.inputToken.decimals),
  };
}

export function calculateMinTokenAmount(tokenAmount: string, slippage: number): string {
  if (!tokenAmount || tokenAmount === "0") return "0";

  const tokenAmountBN = BigNumber(tokenAmount);
  const slippageRatio = (100 - slippage) / 100;
  const slippageBuffer = tokenAmountBN.multipliedBy(slippage * 2);

  const calculatedMinTokenAmount = tokenAmountBN.multipliedBy(slippageRatio).minus(slippageBuffer);

  return calculatedMinTokenAmount.isPositive() ? calculatedMinTokenAmount.toFixed(0) : "0";
}
