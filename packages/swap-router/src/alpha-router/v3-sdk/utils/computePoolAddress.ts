import { Token } from "../../core";
import { FeeAmount, POOL_INIT_CODE_HASH } from "../constants";

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */
export function computePoolAddress({
  tokenA,
  tokenB,
  fee,
}: {
  tokenA: Token;
  tokenB: Token;
  fee: FeeAmount;
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]; // does safety checks
  return `${token0.address}:${token1.address}:${fee.toString()}`;
}
