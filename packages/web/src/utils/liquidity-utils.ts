import { Q96 } from "./math.utils";

export function liquidityAmountsGetLiquidityForAmount0(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount0: bigint,
): bigint {
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

export function liquidityAmountsGetLiquidityForAmount1(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount1: bigint,
): bigint {
  let currentSqrtRatioAX96 = sqrtRatioAX96;
  let currentSqrtRatioBX96 = sqrtRatioBX96;
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    currentSqrtRatioAX96 = sqrtRatioBX96;
    currentSqrtRatioBX96 = sqrtRatioAX96;
  }

  return (amount1 * Q96) / (currentSqrtRatioBX96 - currentSqrtRatioAX96);
}

export function liquidityAmountsGetLiquidityForAmounts(
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
    liquidity = liquidityAmountsGetLiquidityForAmount0(
      currentSqrtRatioAX96,
      currentSqrtRatioBX96,
      amount0,
    );
  } else if (sqrtRatioX96 < currentSqrtRatioBX96) {
    const liquidity0 = liquidityAmountsGetLiquidityForAmount0(
      sqrtRatioX96,
      currentSqrtRatioBX96,
      amount0,
    );
    const liquidity1 = liquidityAmountsGetLiquidityForAmount1(
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
    liquidity = liquidityAmountsGetLiquidityForAmount1(
      currentSqrtRatioAX96,
      currentSqrtRatioBX96,
      amount1,
    );
  }

  return liquidity;
}

export function liquidityAmountsGetAmount0ForLiquidity(
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

  return (
    ((liquidity << 96n) * (currentSqrtRatioBX96 - currentSqrtRatioAX96)) /
    currentSqrtRatioBX96 /
    currentSqrtRatioAX96
  );
}

export function liquidityAmountsGetAmount1ForLiquidity(
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

export function liquidityAmountsGetAmountsForLiquidity(
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
    amount0 = liquidityAmountsGetAmount0ForLiquidity(
      currentSqrtRatioAX96,
      currentSqrtRatioBX96,
      liquidity,
    );
  } else if (sqrtRatioX96 < currentSqrtRatioBX96) {
    amount0 = liquidityAmountsGetAmount0ForLiquidity(
      sqrtRatioX96,
      currentSqrtRatioBX96,
      liquidity,
    );
    amount1 = liquidityAmountsGetAmount1ForLiquidity(
      currentSqrtRatioAX96,
      sqrtRatioX96,
      liquidity,
    );
  } else {
    amount1 = liquidityAmountsGetAmount1ForLiquidity(
      currentSqrtRatioAX96,
      currentSqrtRatioBX96,
      liquidity,
    );
  }

  return { amount0, amount1 };
}
