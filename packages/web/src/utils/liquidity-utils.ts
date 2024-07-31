import { Q96 } from "./math.utils";

export function getLiquidityForAmount0(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount0: bigint,
): bigint {
  if (sqrtRatioAX96 === sqrtRatioBX96) {
    return 0n;
  }

  let currentSqrtRatioAX96 = sqrtRatioAX96;
  let currentSqrtRatioBX96 = sqrtRatioBX96;
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    currentSqrtRatioAX96 = sqrtRatioBX96;
    currentSqrtRatioBX96 = sqrtRatioAX96;
  }

  const intermediate = (currentSqrtRatioAX96 * currentSqrtRatioBX96) / Q96;

  return (
    (amount0 * intermediate) / (currentSqrtRatioBX96 - currentSqrtRatioAX96)
  );
}

export function getLiquidityForAmount1(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount1: bigint,
): bigint {
  if (sqrtRatioAX96 === sqrtRatioBX96) {
    return 0n;
  }

  let currentSqrtRatioAX96 = sqrtRatioAX96;
  let currentSqrtRatioBX96 = sqrtRatioBX96;
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    currentSqrtRatioAX96 = sqrtRatioBX96;
    currentSqrtRatioBX96 = sqrtRatioAX96;
  }

  return (amount1 * Q96) / (currentSqrtRatioBX96 - currentSqrtRatioAX96);
}

export function getLiquidityForAmounts(
  sqrtRatioX96: bigint,
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount0: bigint,
  amount1: bigint,
): bigint {
  let liquidity = 0n;
  let currentSqrtRatioAX96 = sqrtRatioAX96;
  let currentSqrtRatioBX96 = sqrtRatioBX96;
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    currentSqrtRatioAX96 = sqrtRatioBX96;
    currentSqrtRatioBX96 = sqrtRatioAX96;
  }

  if (sqrtRatioX96 <= currentSqrtRatioAX96) {
    liquidity = getLiquidityForAmount0(
      currentSqrtRatioAX96,
      currentSqrtRatioBX96,
      amount0,
    );
  } else if (sqrtRatioX96 < currentSqrtRatioBX96) {
    const liquidity0 = getLiquidityForAmount0(
      sqrtRatioX96,
      currentSqrtRatioBX96,
      amount0,
    );
    const liquidity1 = getLiquidityForAmount1(
      currentSqrtRatioAX96,
      sqrtRatioX96,
      amount1,
    );

    if (liquidity0 < liquidity1) {
      liquidity = liquidity0;
    } else {
      liquidity = liquidity1;
    }
  } else {
    liquidity = getLiquidityForAmount1(
      currentSqrtRatioAX96,
      currentSqrtRatioBX96,
      amount1,
    );
  }

  return liquidity;
}

export function getAmount0ForLiquidity(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint,
): bigint {
  if (sqrtRatioAX96 === 0n || sqrtRatioBX96 === 0n) {
    return 0n;
  }
  let currentSqrtRatioAX96 = sqrtRatioAX96;
  let currentSqrtRatioBX96 = sqrtRatioBX96;
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    currentSqrtRatioAX96 = sqrtRatioBX96;
    currentSqrtRatioBX96 = sqrtRatioAX96;
  }

  return (
    ((liquidity << 96n) * (currentSqrtRatioBX96 - currentSqrtRatioAX96)) /
    currentSqrtRatioBX96 /
    currentSqrtRatioAX96
  );
}

export function getAmount1ForLiquidity(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint,
): bigint {
  let currentSqrtRatioAX96 = sqrtRatioAX96;
  let currentSqrtRatioBX96 = sqrtRatioBX96;
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    currentSqrtRatioAX96 = sqrtRatioBX96;
    currentSqrtRatioBX96 = sqrtRatioAX96;
  }

  return (liquidity * (currentSqrtRatioBX96 - currentSqrtRatioAX96)) / Q96;
}

export function getAmountsForLiquidity(
  sqrtRatioX96: bigint,
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint,
): {
  amount0: bigint;
  amount1: bigint;
} {
  let amount0 = 0n;
  let amount1 = 0n;
  let currentSqrtRatioAX96 = sqrtRatioAX96;
  let currentSqrtRatioBX96 = sqrtRatioBX96;
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    currentSqrtRatioAX96 = sqrtRatioBX96;
    currentSqrtRatioBX96 = sqrtRatioAX96;
  }

  if (sqrtRatioX96 <= currentSqrtRatioAX96) {
    amount0 = getAmount0ForLiquidity(
      currentSqrtRatioAX96,
      currentSqrtRatioBX96,
      liquidity,
    );
  } else if (sqrtRatioX96 < currentSqrtRatioBX96) {
    amount0 = getAmount0ForLiquidity(
      sqrtRatioX96,
      currentSqrtRatioBX96,
      liquidity,
    );
    amount1 = getAmount1ForLiquidity(
      currentSqrtRatioAX96,
      sqrtRatioX96,
      liquidity,
    );
  } else {
    amount1 = getAmount1ForLiquidity(
      currentSqrtRatioAX96,
      currentSqrtRatioBX96,
      liquidity,
    );
  }

  return { amount0, amount1 };
}
