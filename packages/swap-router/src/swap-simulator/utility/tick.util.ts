import BigNumber from "bignumber.js";
import { MAX_UINT256, MAX_UINT8, Q96 } from "../../constants";
import { LSB, MSB } from "./math.util";

export function tickToPrice(tick: number): number {
  const sqrtPriceX96 = tickToSqrtPriceX96(tick);
  return BigNumber(sqrtPriceX96.toString())
    .dividedBy(Q96.toString())
    .toNumber();
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

export function nextInitializedTickWithinOneWord(
  tickBitmaps: { [key in number]: string },
  tick: number,
  tickSpacing: number,
  isTickToLeft: boolean,
): { tickNext: number; initialized: boolean } {
  let compressed = Number(BigInt(tick) / BigInt(tickSpacing));
  if (tick < 0 && tick % tickSpacing !== 0) {
    compressed--;
  }

  if (isTickToLeft) {
    const { wordPos, bitPos } = tickBitmapPosition(compressed);
    const mask = (1n << BigInt(bitPos)) - 1n + (1n << BigInt(bitPos));
    const bitmap = BigInt(Number(tickBitmaps[wordPos]) || 0n);
    const masked = bitmap & mask;

    const initialized = masked !== 0n;
    const tickNext = initialized
      ? (compressed - bitPos + Number(MSB(masked))) * tickSpacing
      : (compressed - bitPos) * tickSpacing;
    return { tickNext, initialized };
  }

  const { wordPos, bitPos } = tickBitmapPosition(compressed + 1);
  const mask = ~((1n << BigInt(bitPos)) - 1n);
  const bitmap = BigInt(Number(tickBitmaps[wordPos]) || 0n);
  const masked = bitmap & mask;

  const initialized = masked !== 0n;
  const nextCompressed = compressed + 1;
  const tickNext = initialized
    ? (nextCompressed + (Number(LSB(masked)) - bitPos)) * tickSpacing
    : (nextCompressed +
        BigNumber(MAX_UINT8.toString()).minus(bitPos).toNumber()) *
      tickSpacing;
  return {
    tickNext,
    initialized,
  };
}

function tickBitmapPosition(tick: number): { wordPos: number; bitPos: number } {
  const wordPos = tick >> 8; // tick >> 8
  const bitPos = tick % 256;

  return {
    wordPos: wordPos,
    bitPos: bitPos >= 0 ? bitPos : bitPos + 256,
  };
}

export function sqrtPriceX96ToTick(sqrtPriceX96: bigint) {
  const ratio = sqrtPriceX96 << 32n;

  let r = ratio;
  let msb = 0n;

  // array
  const _tv = [
    0x0n,
    0x3n,
    0xfn,
    0xffn,
    0xffffn,
    0xffffffffn,
    0xffffffffffffffffn,
    0xffffffffffffffffffffffffffffffffn,
  ] as const;

  let f = 0n;
  for (let i = 7; i >= 1; i--) {
    f = gt(r, _tv[i]) << BigInt(i);
    msb = msb | f;
    r = r >> f;
  }
  {
    f = gt(r, 0x1n);
    msb = msb | f;
  }

  if (msb >= 128) {
    r = ratio >> (msb - 127n);
  } else {
    r = ratio << (127n - msb);
  }

  let log_2 = (msb - 128n) << 64n;

  for (let i = 63; i >= 51; i--) {
    r = (r * r) >> 127n;
    f = r >> 128n;
    log_2 = log_2 | (f << BigInt(i));
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    f = r >> 128n;
    log_2 = log_2 | (f << 50n);
  }

  const log_sqrt10001 = log_2 * 255738958999603826347141n;

  const tickLow =
    (log_sqrt10001 - 3402992956809132418596140100660247210n) >> 128n;
  const tickHi =
    (log_sqrt10001 + 291339464771989622907027621153398088495n) >> 128n;

  let tick = tickLow;
  if (tickLow == tickHi) {
    if (tickToSqrtPriceX96(Number(tickHi)) <= sqrtPriceX96) {
      tick = tickHi;
    }
  }

  return Number(tick);
}

function gt(x: bigint, y: bigint): bigint {
  return x > y ? 1n : 0n;
}
