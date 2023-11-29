import BigNumber from "bignumber.js";
import {
  MAX_UINT128,
  MAX_UINT16,
  MAX_UINT32,
  MAX_UINT64,
  MAX_UINT8,
  Q96,
} from "../../constants";

export function fromSqrtX96(value: number | bigint) {
  return BigNumber(`${value}`).dividedBy(Q96.toString()).sqrt().toNumber();
}

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
  let r = 255n;
  let calculated = BigInt(x);

  if ((calculated & MAX_UINT128) > 0n) {
    r -= 128n;
  } else {
    calculated >>= 128n;
  }

  if ((calculated & MAX_UINT64) > 0n) {
    r -= 64n;
  } else {
    calculated >>= 64n;
  }

  if ((calculated & MAX_UINT32) > 0n) {
    r -= 32n;
  } else {
    calculated >>= 32n;
  }

  if ((calculated & MAX_UINT16) > 0n) {
    r -= 16n;
  } else {
    calculated >>= 16n;
  }

  if ((calculated & MAX_UINT8) > 0n) {
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
