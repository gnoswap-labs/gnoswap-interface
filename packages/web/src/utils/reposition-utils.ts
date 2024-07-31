import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import { toShiftBitInt } from "./number-utils";

import { getDepositAmountsByAmountA, getDepositAmountsByAmountB } from "./swap-utils";
import { makeDisplayTokenAmount, makeShiftAmount } from "./token-utils";

const DEPOSIT_AMOUNT_10_POW_8 = 100_000_000n;

export function getRepositionAmountsByPriceRange(
  currentPrice: number,
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
      ? getDepositAmountsByAmountA(
          currentPrice,
          originMinPrice,
          originMaxPrice,
          DEPOSIT_AMOUNT_10_POW_8,
        )
      : getDepositAmountsByAmountB(
          currentPrice,
          originMinPrice,
          originMaxPrice,
          DEPOSIT_AMOUNT_10_POW_8,
        );

  const newDepositAmounts =
    currentPrice <= repositionMaxPrice
      ? getDepositAmountsByAmountA(
          currentPrice,
          repositionMinPrice,
          repositionMaxPrice,
          DEPOSIT_AMOUNT_10_POW_8,
        )
      : getDepositAmountsByAmountB(
          currentPrice,
          repositionMinPrice,
          repositionMaxPrice,
          DEPOSIT_AMOUNT_10_POW_8,
        );

  const originDepositRatioBN = BigNumber(
    originDepositAmounts.amountA.toString(),
  ).dividedBy(
    Number(originDepositAmounts.amountA.toString()) +
      Number(originDepositAmounts.amountB.toString()),
  );
  const newDepositRatioBN = BigNumber(
    Number(newDepositAmounts.amountA),
  ).dividedBy(
    Number(newDepositAmounts.amountA) + Number(newDepositAmounts.amountB),
  );

  console.log("origin",originDepositAmounts, originDepositRatioBN.toString());
  console.log("new",newDepositAmounts, newDepositRatioBN.toString());

  const amountARatioBN = newDepositRatioBN.dividedBy(originDepositRatioBN);
  const amountBRatioBN = BigNumber(1 - newDepositRatioBN.toNumber()).dividedBy(
    1 - originDepositRatioBN.toNumber(),
  );

  if (originDepositRatioBN.isEqualTo(0)) {
    const amountBBN =
      BigNumber(originToken1Balance).multipliedBy(amountBRatioBN);
    const amountABN = amountBBN
      .multipliedBy(BigNumber(newDepositAmounts.amountA.toString()))
      .div(newDepositAmounts.amountB.toString());

    return {
      amountA:
        newDepositAmounts.amountB.toString() !== "0"
          ? Number(amountABN.toFixed(6))
          : Number.POSITIVE_INFINITY,
      amountB: Number(amountBBN.toFixed(6)),
    };
  }
  if (originDepositRatioBN.isEqualTo(1)) {
    const amountABN =
      BigNumber(originToken0Balance).multipliedBy(amountARatioBN);
    const amountBBN = amountABN
      .multipliedBy(BigNumber(newDepositAmounts.amountB.toString()))
      .div(newDepositAmounts.amountA.toString());

    return {
      amountA: Number(amountABN.toFixed(6)),
      amountB:
        newDepositAmounts.amountA.toString() !== "0"
          ? Number(amountBBN.toFixed(6))
          : Number.POSITIVE_INFINITY,
    };
  }

  return {
    amountA: BigNumber(originToken0Balance)
      .multipliedBy(amountARatioBN)
      .toNumber(),
    amountB: BigNumber(originToken1Balance)
      .multipliedBy(amountBRatioBN)
      .toNumber(),
  };
}

export function getRepositionAmountsWithSwapSimulation(
  currentPrice: number,
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
  const { amountA: repositionAmountA, amountB: repositionAmountB } =
    initialEstimatedRepositionAmounts;

  const isSwapAtoB = swapInputToken === tokenA;

  if (isSwapAtoB) {
    const estimatedAmountA = repositionAmountA;
    const estimatedAmountB =
      (makeDisplayTokenAmount(tokenB, swapOutputAmount) || 0) + Number(amountB);

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
        repositionMinPrice || 1,
        repositionMaxPrice || 1,
        toShiftBitInt(estimatedAmountB || 0, tokenB.decimals),
      );
      return {
        amountA: makeShiftAmount(
          depositAmounts.amountA,
          tokenA.decimals * -1,
        ).toString(),
        amountB: makeShiftAmount(
          depositAmounts.amountB,
          tokenB.decimals * -1,
        ).toString(),
      };
    }

    const depositAmounts = getDepositAmountsByAmountA(
      currentPrice,
      repositionMinPrice || 1,
      repositionMaxPrice || 1,
      toShiftBitInt(estimatedAmountA, tokenA.decimals),
    );
    return {
      amountA: makeShiftAmount(
        depositAmounts.amountA,
        tokenA.decimals * -1,
      ).toString(),
      amountB: makeShiftAmount(
        depositAmounts.amountB,
        tokenB.decimals * -1,
      ).toString(),
    };
  }

  const estimatedAmountA =
    (makeDisplayTokenAmount(tokenA, swapOutputAmount) || 0) + Number(amountA);
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
      repositionMinPrice || 1,
      repositionMaxPrice || 1,
      toShiftBitInt(estimatedAmountA || 0, tokenA.decimals),
    );
    return {
      amountA: makeShiftAmount(
        depositAmounts.amountA,
        tokenA.decimals * -1,
      ).toString(),
      amountB: makeShiftAmount(
        depositAmounts.amountB,
        tokenB.decimals * -1,
      ).toString(),
    };
  }

  const depositAmounts = getDepositAmountsByAmountB(
    currentPrice,
    repositionMinPrice || 1,
    repositionMaxPrice || 1,
    toShiftBitInt(estimatedAmountB || 0, tokenB.decimals),
  );

  return {
    amountA: makeShiftAmount(
      depositAmounts.amountA,
      tokenA.decimals * -1,
    ).toString(),
    amountB: makeShiftAmount(
      depositAmounts.amountB,
      tokenB.decimals * -1,
    ).toString(),
  };
}