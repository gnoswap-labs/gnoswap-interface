import { TokenPairInfo } from "@models/token/token-pair-info";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import { isNumber } from "./number-utils";

/**
 * Shortens an address by N characters.
 * If the address has already been shortened, return as it is.
 * @param address wallet address for formatting
 * @param num amount of characters to shorten on both sides (default value is 5)
 * @returns formatted string
 */
export function formatAddress(address: string, num?: number): string {
  const fix = num ?? 5;
  const already = address.length <= fix * 2 + 3 && address.includes("...");
  if (already) return address;

  return `${address.substring(0, fix)}...${address.substring(
    address.length - fix,
  )}`;
}

export function tokenPairSymbolToOneCharacter(
  tokenPair: TokenPairInfo,
): string {
  const symbol0 = tokenPair.tokenA.symbol;
  const symbol1 = tokenPair.tokenB.symbol;
  return `${symbol0}/${symbol1}`;
}

export function makePairName({
  tokenA,
  tokenB,
}: {
  tokenA: TokenModel;
  tokenB: TokenModel;
}): string {
  const symbolA = tokenA.symbol;
  const symbolB = tokenB.symbol;
  return `${symbolA}/${symbolB}`;
}

export function numberToFormat(num: string | number, options?: { decimals?: number, forceDecimals?: boolean }) {
  const decimal = options?.forceDecimals ? options?.decimals : (Number.isInteger(Number(num)) ? 0 : options?.decimals);
  return isNumber(Number(num)) ? BigNumber(num).toFormat(decimal || 0) : "0";
}

export function numberToString(num: string | number, decimals?: number) {
  const decimal = Number.isInteger(Number(num)) ? 0 : decimals;
  return BigNumber(num).toFixed(decimal || 0);
}

export function displayTickNumber(range: number[], tick: number) {
  const rangeGap = (range[1] - range[0]) / 10;
  const rangeGapSplit = `${rangeGap}`.split(".");
  if (rangeGap > 1) {
    const fixedPosition = rangeGapSplit[0].length;
    return BigNumber(tick)
      .shiftedBy(fixedPosition)
      .shiftedBy(-fixedPosition)
      .toFormat(0);
  }
  if (rangeGapSplit.length < 2) {
    return tick.toFixed(1);
  }
  const fixedPosition =
    Array.from(rangeGapSplit[1], v => v).findIndex(v => v !== "0") + 1;
  return tick.toFixed(fixedPosition);
}
