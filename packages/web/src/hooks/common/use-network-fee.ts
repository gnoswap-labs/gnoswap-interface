import React from "react";

import { GasInfo, useGetEstimateGasInfo } from "@hooks/gas";
import { Document } from "src/types/transaction-messages.types";

export interface UseNetworkFeeReturn {
  currentGasInfo: GasInfo | null;
}

export const useNetworkFee = (document: Document | null, gasInfo?: GasInfo | null): UseNetworkFeeReturn => {
  const { data: estimatedGasInfo } = useGetEstimateGasInfo(document, gasInfo?.gasUsed || 0);

  const currentGasInfo = React.useMemo(() => {
    if (!estimatedGasInfo) return null;
    return estimatedGasInfo;
  }, [estimatedGasInfo]);

  return {
    currentGasInfo,
  };
};
