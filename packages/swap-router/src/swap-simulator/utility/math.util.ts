import BigNumber from "bignumber.js";

export const Q96 = 79228162514264337593543950336n as const;
export const Q128 = 340282366920938463463374607431768211456n as const;

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
