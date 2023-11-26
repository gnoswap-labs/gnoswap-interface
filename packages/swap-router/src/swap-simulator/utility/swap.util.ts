import BigNumber from "bignumber.js";
import { MAX_UINT160, Q96 } from "./math.util";

export function getNextSqrtPriceFromAmountARoundingUp(
  sqrtPriceX96: bigint,
  liquidity: bigint,
  amount: bigint,
  added: boolean,
): bigint {
  if (amount === 0n) {
    return sqrtPriceX96;
  }
  const numerator1 = liquidity << 96n;
  const product = amount * sqrtPriceX96;

  let denominator = 0n;

  if (added) {
    if (product / amount == sqrtPriceX96) {
      denominator = numerator1 + product;
      if (denominator >= numerator1) {
        return (numerator1 * sqrtPriceX96) / denominator;
      }
    }
    return numerator1 / (numerator1 / sqrtPriceX96 + amount);
  }
  denominator = numerator1 - product;
  return (numerator1 * sqrtPriceX96) / denominator;
}

export function getNextSqrtPriceFromAmountBRoundingDown(
  sqrtPriceX96: bigint,
  liquidity: bigint,
  amount: bigint,
  added: boolean,
): bigint {
  let quotient = 0n;
  if (added) {
    if (amount <= MAX_UINT160) {
      quotient = (amount << 96n) / liquidity;
    } else {
      quotient = (amount * Q96) / liquidity;
    }
    return sqrtPriceX96 + quotient;
  } else {
    if (amount <= MAX_UINT160) {
      quotient = (amount << 96n) / liquidity;
    } else {
      quotient = (amount * Q96) / liquidity;
    }

    return sqrtPriceX96 - quotient;
  }
}

export function getNextSqrtPriceFromInput(
  sqrtPriceX96: bigint,
  liquidity: bigint,
  amountIn: bigint,
  zeroForOne: boolean,
): bigint {
  if (zeroForOne) {
    return getNextSqrtPriceFromAmountARoundingUp(
      sqrtPriceX96,
      liquidity,
      amountIn,
      true,
    );
  }
  return getNextSqrtPriceFromAmountBRoundingDown(
    sqrtPriceX96,
    liquidity,
    amountIn,
    true,
  );
}

export function getNextSqrtPriceFromOutput(
  sqrtPriceX96: bigint,
  liquidity: bigint,
  amountOut: bigint,
  zeroForOne: boolean,
): bigint {
  if (zeroForOne) {
    return getNextSqrtPriceFromAmountBRoundingDown(
      sqrtPriceX96,
      liquidity,
      amountOut,
      false,
    );
  }

  return getNextSqrtPriceFromAmountARoundingUp(
    sqrtPriceX96,
    liquidity,
    amountOut,
    false,
  );
}

export function getAmountADeltaHelper(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint,
): bigint {
  let changedSqrtRatioA = sqrtRatioAX96;
  let changedSqrtRatioB = sqrtRatioBX96;

  if (sqrtRatioAX96 > sqrtRatioBX96) {
    changedSqrtRatioA = sqrtRatioBX96;
    changedSqrtRatioB = sqrtRatioAX96;
  }

  const numerator1 = BigNumber(liquidity.toString()).multipliedBy(
    Q96.toString(),
  );
  const numerator2 = changedSqrtRatioB - changedSqrtRatioA;

  return BigInt(
    numerator1
      .multipliedBy(numerator2.toString())
      .dividedBy(changedSqrtRatioA.toString())
      .dividedBy(changedSqrtRatioB.toString())
      .toFixed(0, BigNumber.ROUND_FLOOR),
  );
}

export function getAmountBDeltaHelper(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint,
): bigint {
  let changedSqrtRatioA = sqrtRatioAX96;
  let changedSqrtRatioB = sqrtRatioBX96;

  if (sqrtRatioAX96 > sqrtRatioBX96) {
    changedSqrtRatioA = sqrtRatioBX96;
    changedSqrtRatioB = sqrtRatioAX96;
  }

  return ((changedSqrtRatioB - changedSqrtRatioA) * liquidity) / Q96;
}

export function getAmountADelta(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint,
): bigint {
  if (liquidity < 0) {
    return -getAmountADeltaHelper(sqrtRatioAX96, sqrtRatioBX96, -liquidity);
  }

  return getAmountADeltaHelper(sqrtRatioAX96, sqrtRatioBX96, liquidity);
}

export function getAmountBDelta(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint,
): bigint {
  if (liquidity < 0) {
    return -getAmountBDeltaHelper(sqrtRatioAX96, sqrtRatioBX96, -liquidity);
  }

  return getAmountADeltaHelper(sqrtRatioAX96, sqrtRatioBX96, liquidity);
}

export function computeSwapStep(
  sqrtRatioCurrentX96: bigint,
  sqrtRatioTargetX96: bigint,
  liquidity: bigint,
  amountRemaining: bigint,
  fee: number,
): {
  sqrtRatioNextX96: bigint;
  amountIn: bigint;
  amountOut: bigint;
  feeAmount: bigint;
} {
  const exactIn = amountRemaining >= 0;
  const zeroForOne = sqrtRatioCurrentX96 >= sqrtRatioTargetX96;
  let amountIn = 0n;
  let amountOut = 0n;
  let sqrtRatioNextX96 = 0n;

  if (exactIn) {
    const amountRemainingLessFee =
      (amountRemaining * (1000000n - BigInt(fee))) / 1000000n;

    if (zeroForOne) {
      amountIn = getAmountADeltaHelper(
        sqrtRatioTargetX96,
        sqrtRatioCurrentX96,
        liquidity,
      );
    } else {
      amountIn = getAmountBDeltaHelper(
        sqrtRatioCurrentX96,
        sqrtRatioTargetX96,
        liquidity,
      );
    }

    if (amountRemainingLessFee >= amountIn) {
      sqrtRatioNextX96 = sqrtRatioTargetX96;
    } else {
      sqrtRatioNextX96 = getNextSqrtPriceFromInput(
        sqrtRatioCurrentX96,
        liquidity,
        amountRemainingLessFee,
        zeroForOne,
      );
    }
  } else {
    if (zeroForOne) {
      amountOut = getAmountBDeltaHelper(
        sqrtRatioTargetX96,
        sqrtRatioCurrentX96,
        liquidity,
      );
    } else {
      amountOut = getAmountADeltaHelper(
        sqrtRatioCurrentX96,
        sqrtRatioTargetX96,
        liquidity,
      );
    }

    const positiveAmountRemaining =
      amountRemaining >= 0 ? amountRemaining : amountRemaining * -1n;
    if (positiveAmountRemaining >= amountOut) {
      sqrtRatioNextX96 = sqrtRatioTargetX96;
    } else {
      sqrtRatioNextX96 = getNextSqrtPriceFromOutput(
        sqrtRatioCurrentX96,
        liquidity,
        positiveAmountRemaining,
        zeroForOne,
      );
    }
  }

  const max = sqrtRatioTargetX96 === sqrtRatioNextX96;

  if (zeroForOne) {
    if (!max || !exactIn) {
      amountIn = getAmountADeltaHelper(
        sqrtRatioNextX96,
        sqrtRatioCurrentX96,
        liquidity,
      );
    }

    if (!max || exactIn) {
      amountOut = getAmountBDeltaHelper(
        sqrtRatioNextX96,
        sqrtRatioCurrentX96,
        liquidity,
      );
    }
  } else {
    if (!max || !exactIn) {
      amountIn = getAmountBDeltaHelper(
        sqrtRatioCurrentX96,
        sqrtRatioNextX96,
        liquidity,
      );
    }

    if (!max || exactIn) {
      amountOut = getAmountADeltaHelper(
        sqrtRatioCurrentX96,
        sqrtRatioNextX96,
        liquidity,
      );
    }
  }

  const positiveAmountRemaining =
    amountRemaining >= 0 ? amountRemaining : amountRemaining * -1n;
  if (!exactIn && amountOut > positiveAmountRemaining) {
    amountOut = positiveAmountRemaining;
  }

  let feeAmount = 0n;
  if (exactIn && sqrtRatioNextX96 !== sqrtRatioTargetX96) {
    feeAmount = amountRemaining - amountIn;
  } else {
    feeAmount = (amountIn * BigInt(fee)) / (1000000n - BigInt(fee));
  }

  return {
    sqrtRatioNextX96,
    amountIn,
    amountOut,
    feeAmount,
  };
}
