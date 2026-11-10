import BigNumber from "bignumber.js";

/** Owner-net minimum for a full Limit fill, rounded up in raw output units as the realm does. */
export function calculateLimitMinimumReceived(rawTakingAmount: string, slippageBps: number): string {
  return BigNumber(rawTakingAmount || 0)
    .multipliedBy(10_000 - slippageBps)
    .dividedBy(10_000)
    .toFixed(0, BigNumber.ROUND_CEIL);
}
