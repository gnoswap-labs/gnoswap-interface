import {
  INCENTIVE_TYPE,
  SwapFeeTierInfoMap,
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import { tickToPriceStr } from "./swap-utils";

const maxTicks = Object.values(SwapFeeTierMaxPriceRangeMap).map(
  range => range.maxTick,
);
const minTicks = Object.values(SwapFeeTierMaxPriceRangeMap).map(
  range => range.maxTick,
);

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
  return (
    [tokenAPath, tokenBPath].sort().join(":") +
    ":" +
    SwapFeeTierInfoMap[swapFeeTier].fee
  );
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

export function checkPoolStakingRewards(type?: INCENTIVE_TYPE) {
  return ["INCENTIVIZED", "EXTERNAL"].includes(type || "");
}

export function isOrderedTokenPaths(
  tokenAPath: string,
  tokenBPath: string,
): boolean {
  return [tokenAPath, tokenBPath].sort()?.[0] === tokenAPath;
}
