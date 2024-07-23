import {
  INCENTIVE_TYPE,
  SwapFeeTierMaxPriceRangeMap,
} from "@constants/option.constant";
import { tickToPriceStr } from "./swap-utils";

const maxTicks = Object.values(SwapFeeTierMaxPriceRangeMap).map(
  range => range.maxTick,
);
const minTicks = Object.values(SwapFeeTierMaxPriceRangeMap).map(
  range => range.maxTick,
);

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
