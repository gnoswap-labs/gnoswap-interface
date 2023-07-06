import { TokenPairModel } from "@models/token/token-pair-model";
import { addressValidationCheck } from "./validation-utils";

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
  const parsed = addressValidationCheck(address);
  if (!parsed) throw Error("Invalid address.");
  return `${address.substring(0, fix)}...${address.substring(
    address.length - fix,
  )}`;
}

export function tokenPairSymbolToOneCharacter(
  tokenPair: TokenPairModel,
): string {
  const symbol0 = tokenPair.token0.symbol;
  const symbol1 = tokenPair.token1.symbol;
  return `${symbol0}/${symbol1}`;
}
