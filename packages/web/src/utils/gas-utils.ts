import BigNumber from "bignumber.js";
import { DEFAULT_GAS_WANTED } from "@common/values";

export function calculateAdjustedGasFee(
  gasUsed: number | null | undefined,
  gasPrice: string | number,
  multiplier: number,
): {
  gasFee: number;
  gasUsed: number;
  gasWanted: number;
} {
  const used = gasUsed || DEFAULT_GAS_WANTED;

  const adjustGasUsedBN = BigNumber(used).multipliedBy(multiplier);
  const adjustGasUsed = adjustGasUsedBN.toFixed(0, BigNumber.ROUND_DOWN);
  const adjustGasPriceBN = BigNumber(gasPrice);
  const gasFee = adjustGasPriceBN.multipliedBy(adjustGasUsed).toFixed(0, BigNumber.ROUND_UP);

  return {
    gasFee: Number(gasFee),
    gasUsed: Number(adjustGasUsed),
    gasWanted: Number(adjustGasUsed),
  };
}
