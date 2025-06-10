import React from "react";
import BigNumber from "bignumber.js";

import { GasInfo, NetworkFee, useGetEstimateGasInfo } from "@hooks/gas";
import { Document } from "src/types/transaction-messages.types";
import { GasToken } from "@common/values/token-constant";

export interface UseNetworkFeeReturn {
  currentGasInfo: GasInfo | null;
  networkFee: NetworkFee | null;
}

export const useNetworkFee = (document: Document | null, gasInfo?: GasInfo | null): UseNetworkFeeReturn => {
  const { data: estimatedGasInfo } = useGetEstimateGasInfo(document, gasInfo?.gasUsed || 0);

  const currentGasInfo = React.useMemo(() => {
    if (!estimatedGasInfo) return null;
    return estimatedGasInfo;
  }, [estimatedGasInfo]);

  const networkFee: NetworkFee | null = React.useMemo(() => {
    if (!currentGasInfo) return null;

    const networkFeeAmount = BigNumber(currentGasInfo.gasFee)
      .shiftedBy(-GasToken.decimals)
      .toFixed(GasToken.decimals)
      .replace(/(\.\d*?)0+$/, "$1")
      .replace(/\.$/, "");

    return {
      amount: networkFeeAmount,
      denom: GasToken.symbol,
    };
  }, [currentGasInfo]);

  return {
    currentGasInfo,
    networkFee,
  };
};
