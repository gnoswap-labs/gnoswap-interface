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
  const tokenACheckedPath = checkGnotPath(tokenAPath);
  const tokenBCheckedPath = checkGnotPath(tokenBPath);

  return [...items].sort((a, b) => {
    const itemACheckedPath = checkGnotPath(a.token.path);
    const itemBCheckedPath = checkGnotPath(b.token.path);

    const groupA = itemACheckedPath === tokenACheckedPath ? 0 : itemACheckedPath === tokenBCheckedPath ? 1 : 2;
    const groupB = itemBCheckedPath === tokenACheckedPath ? 0 : itemBCheckedPath === tokenBCheckedPath ? 1 : 2;

    if (groupA !== groupB) {
      return groupA - groupB;
    }

    return itemACheckedPath.localeCompare(itemBCheckedPath);
  });
}
