import { GAS_WANTED_BUFFER_MULTIPLIER } from "@common/values";
import { calculateAdjustedGasFee } from "@utils/gas-utils";

import { GasInfo } from "./types";

export function buildGasInfo(
  resultGasUsed: { gasUsed: number; errorMessage: string | null } | null,
  gasPrice: number,
): GasInfo {
  if (!resultGasUsed) {
    return {
      status: "error",
      simulateErrorMessage: "",
    };
  }

  if (resultGasUsed.errorMessage !== null) {
    return {
      status: "error",
      simulateErrorMessage: resultGasUsed.errorMessage,
    };
  }

  const { gasFee, gasUsed, gasWanted } = calculateAdjustedGasFee(
    resultGasUsed.gasUsed,
    gasPrice,
    GAS_WANTED_BUFFER_MULTIPLIER,
  );

  return {
    status: "success",
    gasFee,
    gasUsed,
    gasWanted,
    gasPrice,
  };
}

export const getGasUsed = (gasInfo: GasInfo | null | undefined): number =>
  gasInfo?.status === "success" ? gasInfo.gasUsed : 0;
