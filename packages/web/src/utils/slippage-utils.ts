import BigNumber from "bignumber.js";

export function calculateMaxTokenAmount(tokenAmount: string, slippage: number): string {
  if (!tokenAmount || BigNumber(tokenAmount).isZero()) {
    return "0";
  }

  return BigNumber(tokenAmount)
    .multipliedBy(100 + slippage)
    .dividedBy(100)
    .integerValue(BigNumber.ROUND_CEIL)
    .toFixed(0);
}

export function calculateMinTokenAmount(tokenAmount: string, slippage: number): string {
  if (!tokenAmount || BigNumber(tokenAmount).isZero()) {
    return "0";
  }

  return BigNumber(tokenAmount)
    .multipliedBy(100 - slippage)
    .dividedBy(100)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toFixed(0);
}
