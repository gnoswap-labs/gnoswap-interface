import { Q96, X96 } from "@constants/swap.constant";
import BigNumber from "bignumber.js";

export const MIN_INT8 = -128n as const;
export const MAX_INT8 = 127n as const;
export const MAX_UINT8 = 255n as const;

export const MIN_INT16 = -32768n as const;
export const MAX_INT16 = 32767n as const;
export const MAX_UINT16 = 65535n as const;

export const MIN_INT32 = -2147483648n as const;
export const MAX_INT32 = 2147483647n as const;
export const MAX_UINT32 = 4294967295n as const;

export const MIN_INT64 = -9223372036854775808n as const;
export const MAX_INT64 = 9223372036854775807n as const;
export const MAX_UINT64 = 18446744073709551615n as const;

export const MIN_INT128 = -170141183460469231731687303715884105728n as const;
export const MAX_INT128 = 170141183460469231731687303715884105727n as const;
export const MAX_UINT128 = 340282366920938463463374607431768211455n as const;

export const MIN_INT256 = -57896044618658097711785492504343953926634992332820282019728792003956564819968n as const;
export const MAX_INT256 = 57896044618658097711785492504343953926634992332820282019728792003956564819967n as const;
export const MAX_UINT256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935n as const;

export const MAX_UINT160 = 1461501637330902918203684832716283019655932542975n as const;

export function MSB(x: number | bigint): bigint {
  let r = 0n;
  let calculated = BigInt(x);

  if (calculated >= 0x100000000000000000000000000000000n) {
    calculated >>= 128n;
    r += 128n;
  }

  if (calculated >= 0x10000000000000000n) {
    calculated >>= 64n;
    r += 64n;
  }

  if (calculated >= 0x100000000n) {
    calculated >>= 32n;
    r += 32n;
  }

  if (calculated >= 0x10000n) {
    calculated >>= 16n;
    r += 16n;
  }

  if (calculated >= 0x100n) {
    calculated >>= 8n;
    r += 8n;
  }

  if (calculated >= 0x10n) {
    calculated >>= 4n;
    r += 4n;
  }

  if (calculated >= 0x4n) {
    calculated >>= 2n;
    r += 2n;
  }

  if (calculated >= 0x2n) {
    r += 1n;
  }

  return r;
}

export function LSB(x: number | bigint): bigint {
  let r = 0n;
  let calculated = BigInt(x);

  if (Number(calculated & MAX_UINT128) > 0) {
    r -= 128n;
  } else {
    calculated >>= 128n;
  }

  if (Number(calculated & MAX_UINT64) > 0) {
    r -= 64n;
  } else {
    calculated >>= 64n;
  }

  if (Number(calculated & MAX_UINT32) > 0) {
    r -= 32n;
  } else {
    calculated >>= 32n;
  }

  if (Number(calculated & MAX_UINT16) > 0) {
    r -= 16n;
  } else {
    calculated >>= 16n;
  }

  if (Number(calculated & MAX_UINT8) > 0) {
    r -= 8n;
  } else {
    calculated >>= 8n;
  }

  if ((calculated & 0xfn) > 0) {
    r -= 4n;
  } else {
    calculated >>= 4n;
  }

  if ((calculated & 0x3n) > 0) {
    r -= 2n;
  } else {
    calculated >>= 2n;
  }

  if ((calculated & 0x1n) > 0) {
    r -= 1n;
  }

  return r;
}

export function tickToSqrtPriceX96(tick: number): bigint {
  const absTick = BigInt(Math.abs(tick));

  let ratio = 0x100000000000000000000000000000000n;
  if (Number(absTick & 0x1n) !== 0) {
    ratio = 0xfffcb933bd6fad37aa2d162d1a594001n;
  }

  if (Number(absTick & 0x2n) !== 0) {
    ratio = (ratio * 0xfff97272373d413259a46990580e213an) >> 128n;
  }
  if (Number(absTick & 0x4n) !== 0) {
    ratio = (ratio * 0xfff2e50f5f656932ef12357cf3c7fdccn) >> 128n;
  }
  if (Number(absTick & 0x8n) !== 0) {
    ratio = (ratio * 0xffe5caca7e10e4e61c3624eaa0941cd0n) >> 128n;
  }
  if (Number(absTick & 0x10n) !== 0) {
    ratio = (ratio * 0xffcb9843d60f6159c9db58835c926644n) >> 128n;
  }
  if (Number(absTick & 0x20n) !== 0) {
    ratio = (ratio * 0xff973b41fa98c081472e6896dfb254c0n) >> 128n;
  }
  if (Number(absTick & 0x40n) !== 0) {
    ratio = (ratio * 0xff2ea16466c96a3843ec78b326b52861n) >> 128n;
  }
  if (Number(absTick & 0x80n) !== 0) {
    ratio = (ratio * 0xfe5dee046a99a2a811c461f1969c3053n) >> 128n;
  }
  if (Number(absTick & 0x100n) !== 0) {
    ratio = (ratio * 0xfcbe86c7900a88aedcffc83b479aa3a4n) >> 128n;
  }
  if (Number(absTick & 0x200n) !== 0) {
    ratio = (ratio * 0xf987a7253ac413176f2b074cf7815e54n) >> 128n;
  }
  if (Number(absTick & 0x400n) !== 0) {
    ratio = (ratio * 0xf3392b0822b70005940c7a398e4b70f3n) >> 128n;
  }
  if (Number(absTick & 0x800n) !== 0) {
    ratio = (ratio * 0xe7159475a2c29b7443b29c7fa6e889d9n) >> 128n;
  }
  if (Number(absTick & 0x1000n) !== 0) {
    ratio = (ratio * 0xd097f3bdfd2022b8845ad8f792aa5825n) >> 128n;
  }
  if (Number(absTick & 0x2000n) !== 0) {
    ratio = (ratio * 0xa9f746462d870fdf8a65dc1f90e061e5n) >> 128n;
  }
  if (Number(absTick & 0x4000n) !== 0) {
    ratio = (ratio * 0x70d869a156d2a1b890bb3df62baf32f7n) >> 128n;
  }
  if (Number(absTick & 0x8000n) !== 0) {
    ratio = (ratio * 0x31be135f97d08fd981231505542fcfa6n) >> 128n;
  }
  if (Number(absTick & 0x10000n) !== 0) {
    ratio = (ratio * 0x9aa508b5b7a84e1c677de54f3e99bc9n) >> 128n;
  }
  if (Number(absTick & 0x20000n) !== 0) {
    ratio = (ratio * 0x5d6af8dedb81196699c329225ee604n) >> 128n;
  }
  if (Number(absTick & 0x40000n) !== 0) {
    ratio = (ratio * 0x2216e584f5fa1ea926041bedfe98n) >> 128n;
  }
  if (Number(absTick & 0x80000n) !== 0) {
    ratio = (ratio * 0x48a170391f7dc42444e8fa2n) >> 128n;
  }

  if (tick > 0) {
    ratio = MAX_UINT256 / ratio;
  }

  const shiftedRatio = ratio >> 32n;
  const remainder = ratio % (1n << 32n);
  if (remainder === 0n) {
    return shiftedRatio + 0n;
  } else {
    return shiftedRatio + 1n;
  }
}

export function getNextSqrtPriceFromAmountARoundingUp(
  sqrtPriceX96: bigint,
  liquidity: bigint,
  amount: bigint,
  add: boolean,
): bigint {
  if (amount === 0n) {
    return sqrtPriceX96;
  }

  const numerator1 = BigNumber(liquidity.toString()).multipliedBy(
    Q96.toString(),
  );

  const product = BigNumber(amount.toString()).multipliedBy(
    sqrtPriceX96.toString(),
  );

  let denominator = BigNumber(0);

  if (add) {
    if (product.dividedBy(amount.toString()).eq(sqrtPriceX96.toString())) {
      denominator = numerator1.plus(product);

      if (
        BigNumber(denominator.toString()).isGreaterThanOrEqualTo(numerator1)
      ) {
        return BigInt(
          numerator1
            .multipliedBy(sqrtPriceX96.toString())
            .dividedBy(denominator)
            .toFixed(0),
        );
      }
    }

    const divided = BigNumber(
      numerator1.dividedBy(sqrtPriceX96.toString()),
    ).plus(amount.toString());
    return BigInt(numerator1.dividedBy(divided).toFixed(0));
  }

  denominator = numerator1.minus(product);

  return BigInt(
    numerator1
      .multipliedBy(sqrtPriceX96.toString())
      .dividedBy(denominator)
      .toFixed(0),
  );
}

export function getNextSqrtPriceFromAmountBRoundingDown(
  sqrtPriceX96: bigint,
  liquidity: bigint,
  amount: bigint,
  add: boolean,
): bigint {
  let quotient = 0n;
  if (add) {
    if (amount <= MAX_UINT160) {
      quotient = BigInt(
        BigNumber(amount.toString())
          .dividedBy(liquidity.toString())
          .multipliedBy(X96)
          .toFixed(0),
      );
    } else {
      quotient = amount * (Q96 / liquidity);
    }
    return sqrtPriceX96 + quotient;
  } else {
    if (amount <= MAX_UINT160) {
      quotient = BigInt(
        BigNumber(amount.toString())
          .dividedBy(liquidity.toString())
          .multipliedBy(X96)
          .toFixed(0),
      );
    } else {
      quotient = amount * (Q96 / liquidity);
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
  let changedSqrtRatioAX96 = sqrtRatioAX96;
  let changedSqrtRatioBX96 = sqrtRatioBX96;

  if (sqrtRatioAX96 > sqrtRatioBX96) {
    changedSqrtRatioAX96 = sqrtRatioBX96;
    changedSqrtRatioBX96 = sqrtRatioAX96;
  }

  const numerator1 = BigNumber(liquidity.toString()).multipliedBy(
    BigNumber(2).pow(96),
  );
  const numerator2 = BigNumber(changedSqrtRatioBX96.toString()).minus(
    changedSqrtRatioAX96.toString(),
  );

  return BigInt(
    numerator1
      .multipliedBy(numerator2)
      .dividedBy(changedSqrtRatioBX96.toString())
      .dividedBy(changedSqrtRatioAX96.toString())
      .toFixed(0),
  );
}

export function getAmountBDeltaHelper(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint,
): bigint {
  if (sqrtRatioAX96 <= 0n || sqrtRatioBX96 <= 0n) {
    throw new Error("ratio is 0");
  }
  let changedSqrtRatioAX96 = sqrtRatioAX96;
  let changedSqrtRatioBX96 = sqrtRatioBX96;

  if (sqrtRatioAX96 > sqrtRatioBX96) {
    changedSqrtRatioAX96 = sqrtRatioBX96;
    changedSqrtRatioBX96 = sqrtRatioAX96;
  }

  return BigInt(
    BigNumber((changedSqrtRatioBX96 - changedSqrtRatioAX96).toString())
      .multipliedBy(liquidity.toString())
      .dividedBy(Q96.toString())
      .toFixed(0),
  );
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
