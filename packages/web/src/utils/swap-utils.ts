import BigNumber from "bignumber.js";

export function getCurrentPriceByRaw(raw: string) {
  return BigNumber(raw).dividedBy(2 ** 96);
}
