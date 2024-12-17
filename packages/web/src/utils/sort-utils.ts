/**
 * A comparison function for token path strings
 *
 * to comply with SonarQube's "Provide a compare function when using 'Array.prototype.sort()'" rule.
 * Used as a comparison function for Array.prototype.sort() to determine the order of token paths.
 *
 * Performs lexicographical sorting based on UTF-16 code unit values, identical to default .sort()
 * Handles undefined values by treating them as empty strings
 *
 * @param tokenA - First token path (possibly undefined)
 * @param tokenB - Second token path (possibly undefined)
 * @returns
 * -1 if tokenA < tokenB
 * 1 if tokenA > tokenB
 * 0 if tokenA === tokenB
 *
 * @example
 * Same result as default .sort()
 * ['gns', undefined, 'GNS'].sort() // ['GNS', 'gns', undefined]
 * ['gns', undefined, 'GNS'].sort(compareTokenPaths) // ['GNS', 'gns', undefined]
 *
 * Actual usage examples
 * const tokenPair = [tokenAPath, tokenBPath].sort(compareTokenPaths);
 * const poolPath = [...[WRAPPED_GNOT_PATH, GNS_TOKEN_PATH].sort(compareTokenPaths), "3000"].join(":");
 */
export const sortTokenPaths = (tokenA: string | undefined, tokenB: string | undefined): number => {
  const tokenAString = tokenA ?? "";
  const tokenBString = tokenB ?? "";
  return tokenAString === tokenBString ? 0 : tokenAString > tokenBString ? 1 : -1;
};
