import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";

import { toShiftBitInt } from "./number-utils";
import { getDepositAmountsByAmountA, getDepositAmountsByAmountB } from "./swap-utils";
import { makeDisplayTokenAmount, makeShiftAmount } from "./token-utils";

const DEPOSIT_AMOUNT_10_POW_8 = 100_000_000n;

/**
 * Computes reposition amounts when the origin deposit consists of a single token (ratio is 0 or 1).
 *
 * The primary token amount is scaled by the corresponding new deposit ratio, and the
 * secondary token amount is derived proportionally. Returns `POSITIVE_INFINITY` for the
 * secondary amount when the new range requires none of the primary token, signaling that
 * a swap estimation is needed.
 *
 * @param originBalance - The original balance of the primary token.
 * @param newDepositAmounts - The estimated deposit amounts for the new price range.
 * @param newDepositRatioBN - The deposit ratio (amountA / total) for the new price range.
 * @param side - Which token is the primary: `"A"` for 100% tokenA, `"B"` for 100% tokenB.
 */
function computeSingleSidedAmounts(
  originBalance: string,
  newDepositAmounts: { amountA: bigint | number; amountB: bigint | number },
  newDepositRatioBN: BigNumber,
  side: "A" | "B",
): { amountA: number; amountB: number } {
  const primaryRatio = side === "A" ? newDepositRatioBN : BigNumber(1 - newDepositRatioBN.toNumber());
  const scaledPrimary = BigNumber(originBalance).multipliedBy(primaryRatio);

  const newPrimary = BigNumber(newDepositAmounts[side === "A" ? "amountA" : "amountB"].toString());
  const newSecondary = BigNumber(newDepositAmounts[side === "A" ? "amountB" : "amountA"].toString());

  const secondaryAmount = newPrimary.isZero()
    ? Number.POSITIVE_INFINITY
    : Number(scaledPrimary.multipliedBy(newSecondary).div(newPrimary).toFixed(6));

  return side === "A"
    ? { amountA: Number(scaledPrimary.toFixed(6)), amountB: secondaryAmount }
    : { amountA: secondaryAmount, amountB: Number(scaledPrimary.toFixed(6)) };
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
): {
  amountA: number;
  amountB: number;
} {
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

  const originDepositRatioBN = BigNumber(originDepositAmounts.amountA.toString()).dividedBy(
    Number(originDepositAmounts.amountA.toString()) + Number(originDepositAmounts.amountB.toString()),
  );
  const newDepositRatioBN = BigNumber(Number(newDepositAmounts.amountA)).dividedBy(
    Number(newDepositAmounts.amountA) + Number(newDepositAmounts.amountB),
  );

  if (originDepositRatioBN.isNaN() || newDepositRatioBN.isNaN()) {
    return { amountA: 0, amountB: 0 };
  }

  // When origin ratio is 0 or 1, the general ratio division would cause division-by-zero,
  // so we fall back to single-sided proportional calculation.
  if (originDepositRatioBN.isZero()) {
    return computeSingleSidedAmounts(originToken1Balance, newDepositAmounts, newDepositRatioBN, "B");
  }

  if (originDepositRatioBN.isEqualTo(1)) {
    return computeSingleSidedAmounts(originToken0Balance, newDepositAmounts, newDepositRatioBN, "A");
  }

  const amountARatioBN = newDepositRatioBN.dividedBy(originDepositRatioBN);
  const amountBRatioBN = BigNumber(1 - newDepositRatioBN.toNumber()).dividedBy(1 - originDepositRatioBN.toNumber());

  return {
    amountA: BigNumber(originToken0Balance).multipliedBy(amountARatioBN).toNumber(),
    amountB: BigNumber(originToken1Balance).multipliedBy(amountBRatioBN).toNumber(),
  };
}

export function getRepositionAmountsWithSwapSimulation(
  currentPrice: number,
  sqrtPriceX96: bigint,
  repositionMinPrice: number,
  repositionMaxPrice: number,
  tokenA: TokenModel,
  tokenB: TokenModel,
  currentAmounts: {
    amountA: string;
    amountB: string;
  },
  initialEstimatedRepositionAmounts: {
    amountA: number;
    amountB: number;
  },
  swapInputToken: TokenModel,
  swapOutputAmount: string,
): {
  amountA: string;
  amountB: string;
} {
  const { amountA, amountB } = currentAmounts;
  const { amountA: repositionAmountA, amountB: repositionAmountB } = initialEstimatedRepositionAmounts;

  const isSwapAtoB = swapInputToken === tokenA;

  if (isSwapAtoB) {
    const estimatedAmountA = repositionAmountA;
    const estimatedAmountB = (makeDisplayTokenAmount(tokenB, swapOutputAmount) || 0) + Number(amountB);

    if (estimatedAmountA === 0) {
      return {
        amountA: Number(estimatedAmountA).toString(),
        amountB: Number(estimatedAmountB).toString(),
      };
    }

    const isInsufficientQuantity = repositionAmountB > estimatedAmountB;

    if (isInsufficientQuantity) {
      const depositAmounts = getDepositAmountsByAmountB(
        currentPrice,
        sqrtPriceX96,
        repositionMinPrice || 1,
        repositionMaxPrice || 1,
        toShiftBitInt(estimatedAmountB || 0, tokenB.decimals),
      );
      return {
        amountA: makeShiftAmount(depositAmounts.amountA, tokenA.decimals * -1).toString(),
        amountB: makeShiftAmount(depositAmounts.amountB, tokenB.decimals * -1).toString(),
      };
    }

    const depositAmounts = getDepositAmountsByAmountA(
      currentPrice,
      sqrtPriceX96,
      repositionMinPrice || 1,
      repositionMaxPrice || 1,
      toShiftBitInt(estimatedAmountA, tokenA.decimals),
    );
    return {
      amountA: makeShiftAmount(depositAmounts.amountA, tokenA.decimals * -1).toString(),
      amountB: makeShiftAmount(depositAmounts.amountB, tokenB.decimals * -1).toString(),
    };
  }

  const estimatedAmountA = (makeDisplayTokenAmount(tokenA, swapOutputAmount) || 0) + Number(amountA);
  const estimatedAmountB = repositionAmountB;

  if (estimatedAmountB === 0) {
    return {
      amountA: Number(estimatedAmountA).toString(),
      amountB: Number(estimatedAmountB).toString(),
    };
  }

  const isInsufficientQuantity = repositionAmountA > estimatedAmountA;

  if (isInsufficientQuantity) {
    const depositAmounts = getDepositAmountsByAmountA(
      currentPrice,
      sqrtPriceX96,
      repositionMinPrice || 1,
      repositionMaxPrice || 1,
      toShiftBitInt(estimatedAmountA || 0, tokenA.decimals),
    );
    return {
      amountA: makeShiftAmount(depositAmounts.amountA, tokenA.decimals * -1).toString(),
      amountB: makeShiftAmount(depositAmounts.amountB, tokenB.decimals * -1).toString(),
    };
  }

  const depositAmounts = getDepositAmountsByAmountB(
    currentPrice,
    sqrtPriceX96,
    repositionMinPrice || 1,
    repositionMaxPrice || 1,
    toShiftBitInt(estimatedAmountB || 0, tokenB.decimals),
  );

  return {
    amountA: makeShiftAmount(depositAmounts.amountA, tokenA.decimals * -1).toString(),
    amountB: makeShiftAmount(depositAmounts.amountB, tokenB.decimals * -1).toString(),
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
