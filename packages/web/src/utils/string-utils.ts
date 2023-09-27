import { TokenPairInfo } from "@models/token/token-pair-info";
import { TokenModel } from "@models/token/token-model";

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
