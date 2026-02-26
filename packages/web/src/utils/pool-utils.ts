import {
  DisplayRewardType,
  SwapFeeTierInfoMap,
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { PoolModel } from "@models/pool/pool-model";
import { TokenModel } from "@models/token/token-model";
import { checkGnotPath } from "./common";
import { sortTokenPaths } from "./sort-utils";
import { tickToPriceStr } from "./swap-utils";

const maxTicks = Object.values(SwapFeeTierMaxPriceRangeMap).map(range => range.maxTick);
const minTicks = Object.values(SwapFeeTierMaxPriceRangeMap).map(range => range.maxTick);

const TWO_192 = BigInt("6277101735386680763835789423207666416102355444464034512896");

export function invertSqrtPriceX96(sqrtPriceX96: bigint): bigint {
  if (sqrtPriceX96 === 0n) {
    return 0n;
  }

  return TWO_192 / sqrtPriceX96;
}

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

export function sortDisplayRewards<T extends { token: TokenModel }>(
  infoMap: { [key in DisplayRewardType]: { [key in string]: T } },
  positionData: PoolModel,
): { [key in DisplayRewardType]: { [key in string]: T } } {
  if (!positionData?.tokenA?.path || !positionData?.tokenB?.path) {
    return infoMap;
  }

  const sortedInfoMap = { ...infoMap };

  Object.keys(infoMap).forEach(key => {
    const rewardType = key as DisplayRewardType;
    const rewardsArray = Object.values(sortedInfoMap[rewardType]);

    if (rewardsArray.length > 0) {
      const sortedRewards = sortTokensByPoolOrder(rewardsArray, positionData.tokenA.path, positionData.tokenB.path);

      sortedInfoMap[rewardType] = {};

      sortedRewards.forEach(reward => {
        const priceID = reward.token.priceID || reward.token.path || "unknown-token-priceID";
        sortedInfoMap[rewardType][priceID] = reward;
      });
    }
  });

  return sortedInfoMap;
}
