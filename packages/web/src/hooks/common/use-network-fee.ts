import React from "react";
import BigNumber from "bignumber.js";
import { useAtomValue } from "jotai";

import { GasInfo, NetworkFee, buildGasInfo, getGasUsed, useGetEstimateGasInfo, useGetGasPrice } from "@hooks/gas";
import { Document } from "src/types/transaction-messages.types";
import { GasToken } from "@common/values/token-constant";
import { useGnoswapContext } from "./use-gnoswap-context";
import { makeEstimateGasTransaction } from "@utils/transaction-utils";
import { WalletState } from "@states/index";

export interface UseNetworkFeeReturn {
  currentGasInfo: GasInfo | null;
  networkFee: NetworkFee | null;
  isLoading: boolean;
  estimateNetworkFee: (document: Document) => Promise<{
    currentGasInfo: GasInfo | null;
    networkFee: NetworkFee | null;
  }>;
}

export const useNetworkFee = (document: Document | null, gasInfo?: GasInfo | null): UseNetworkFeeReturn => {
  const walletClient = useAtomValue(WalletState.client);
  const { transactionService, transactionGasService } = useGnoswapContext();
  const { data: gasPrice } = useGetGasPrice();

  const {
    data: estimatedGasInfo,
    isLoading: isLoadingGasInfo,
    isFetching: isFetchingGasInfo,
  } = useGetEstimateGasInfo(document, getGasUsed(gasInfo));

  const currentGasInfo = React.useMemo(() => estimatedGasInfo || null, [estimatedGasInfo]);

  const formatNetworkFeeAmount = (gasFee: string | number): string => {
    const fee = BigNumber(gasFee);
    if (!fee.isFinite() || fee.isNaN()) return "0";

    return fee
      .shiftedBy(-GasToken.decimals)
      .toFixed(GasToken.decimals)
      .replace(/(\.\d*?)0+$/, "$1")
      .replace(/\.$/, "");
  };

  const networkFee: NetworkFee | null = React.useMemo(() => {
    if (!currentGasInfo || currentGasInfo.status !== "success") return null;

    return {
      amount: formatNetworkFeeAmount(currentGasInfo.gasFee),
      denom: GasToken.symbol,
    };
  }, [currentGasInfo]);

  const estimateNetworkFee = async (document: Document) => {
    const walletType = walletClient?.getWalletType();

    if (
      !document ||
      !transactionService ||
      !transactionGasService ||
      !gasPrice ||
      !walletType ||
      walletType === "ADENA"
    ) {
      return {
        currentGasInfo: null,
        networkFee: null,
      };
    }

    try {
      const tx = await makeEstimateGasTransaction(document, transactionService, 0, gasPrice);
      if (!tx) {
        return {
          currentGasInfo: null,
          networkFee: null,
        };
      }

      const resultGasUsed = await transactionGasService
        .estimateGas(tx)
        .then(gasUsed => ({
          gasUsed,
          errorMessage: null,
        }))
        .catch(() => null);

      const gasInfoResult = buildGasInfo(resultGasUsed, gasPrice);

      return {
        currentGasInfo: gasInfoResult,
        networkFee:
          gasInfoResult.status === "success"
            ? {
                amount: formatNetworkFeeAmount(gasInfoResult.gasFee),
                denom: GasToken.symbol,
              }
            : null,
      };
    } catch (error) {
      console.error("Error estimating network fee:", error);
      return {
        currentGasInfo: null,
        networkFee: null,
      };
    }
  };

  const isLoading = React.useMemo(() => {
    if (!document) return false;

    return isFetchingGasInfo || isLoadingGasInfo;
  }, [document, isFetchingGasInfo, isLoadingGasInfo]);

  return {
    currentGasInfo,
    networkFee,
    isLoading,
    estimateNetworkFee,
  };
};
