import { SwapFeeTierInfoMap, SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import { tickToPriceStr } from "./swap-utils";
import { sortTokenPaths } from "./sort-utils";
import { checkGnotPath } from "./common";

const maxTicks = Object.values(SwapFeeTierMaxPriceRangeMap).map(range => range.maxTick);
const minTicks = Object.values(SwapFeeTierMaxPriceRangeMap).map(range => range.maxTick);

export function makePoolPath(
  tokenA: TokenModel | null,
  tokenB: TokenModel | null,
  swapFeeTier: SwapFeeTierType | null,
) {
  if (!tokenA || !tokenB || !swapFeeTier) {
    return "";
  }
  const tokenAPath = tokenA.wrappedPath || tokenA.path || "";
  const tokenBPath = tokenB.wrappedPath || tokenB.path || "";
  return [...[tokenAPath, tokenBPath].sort(sortTokenPaths), SwapFeeTierInfoMap[swapFeeTier].fee].join(":");
}

export function isMaxTick(tick: number) {
  return maxTicks.includes(tick);
}

export function isMinTick(tick: number) {
  return minTicks.includes(tick);
}

export function toMaxPriceStr(tick: number) {
  if (isMaxTick(tick)) {
    return "∞";
  }
  return tickToPriceStr(tick, { decimals: 6 });
}

export function toMinPriceStr(tick: number) {
  if (isMinTick(tick)) {
    return "0";
  }
  return tickToPriceStr(tick, { decimals: 6 });
}

export function checkPoolStakingRewards(incentivized?: boolean) {
  return incentivized === true;
}

export function isOrderedTokenPaths(tokenAPath: string, tokenBPath: string): boolean {
  return [tokenAPath, tokenBPath].sort(sortTokenPaths)?.[0] === tokenAPath;
}

export function sortTokensByPoolOrder<T extends { token: { path: string } }>(
  items: T[],
  tokenAPath: string,
  tokenBPath: string,
): T[] {
  return [...items].sort((a, b) => {
    const itemACheckedPath = checkGnotPath(a.token.path);
    const itemBCheckedPath = checkGnotPath(b.token.path);
    const tokenACheckedPath = checkGnotPath(tokenAPath);
    const tokenBCheckedPath = checkGnotPath(tokenBPath);

    // Make tokens matching tokenA come first
    if (itemACheckedPath === tokenACheckedPath) return -1;
    if (itemBCheckedPath === tokenACheckedPath) return 1;

    // Then make tokens matching tokenB come next
    if (itemACheckedPath === tokenBCheckedPath) return -1;
    if (itemBCheckedPath === tokenBCheckedPath) return 1;

    // Other tokens
    return 0;
  });
}
