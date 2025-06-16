import React from "react";
import BigNumber from "bignumber.js";

import { GasInfo, NetworkFee, useGetEstimateGasInfo, useGetGasPrice } from "@hooks/gas";
import { Document } from "src/types/transaction-messages.types";
import { GasToken } from "@common/values/token-constant";
import { useGnoswapContext } from "./use-gnoswap-context";
import { makeEstimateGasTransaction } from "@utils/transaction-utils";

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
  const { transactionService, transactionGasService } = useGnoswapContext();
  const { data: gasPrice } = useGetGasPrice();

  const {
    data: estimatedGasInfo,
    isLoading: isLoadingGasInfo,
    isFetching: isFetchingGasInfo,
  } = useGetEstimateGasInfo(document, gasInfo?.gasUsed || 0);

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

  const isLoading = React.useMemo(() => {
    if (!document) return false;

    return isFetchingGasInfo || isLoadingGasInfo;
  }, [document, isFetchingGasInfo, isLoadingGasInfo]);

  const estimateNetworkFee = async (document: Document) => {
    if (!document || !transactionService || !transactionGasService || !gasPrice) {
      return {
        currentGasInfo: null,
        networkFee: null,
      };
    }

    try {
      // 트랜잭션 시뮬레이션 생성
      const tx = await makeEstimateGasTransaction(document, transactionService, 0, gasPrice);
      if (!tx) {
        return {
          currentGasInfo: null,
          networkFee: null,
        };
      }

      // 가스 추정
      const resultGasUsed = await transactionGasService
        .estimateGas(tx)
        .then(gasUsed => ({
          gasUsed,
          errorMessage: null,
        }))
        .catch(() => null);

      if (!resultGasUsed) {
        return {
          currentGasInfo: {
            gasFee: 0,
            gasUsed: 0,
            gasWanted: 0,
            gasPrice: 0,
            hasError: true,
            simulateErrorMessage: "",
          },
          networkFee: null,
        };
      }

      const gasFee = BigNumber(resultGasUsed.gasUsed).multipliedBy(gasPrice).toFixed(0, BigNumber.ROUND_UP);

      const gasInfoResult: GasInfo = {
        gasFee: Number(gasFee),
        gasUsed: resultGasUsed.gasUsed,
        gasWanted: resultGasUsed.gasUsed,
        gasPrice: gasPrice,
        hasError: resultGasUsed.errorMessage !== null,
        simulateErrorMessage: resultGasUsed.errorMessage,
      };

      // 네트워크 수수료 계산
      const networkFeeAmount = BigNumber(gasFee)
        .shiftedBy(-GasToken.decimals)
        .toFixed(GasToken.decimals)
        .replace(/(\.\d*?)0+$/, "$1")
        .replace(/\.$/, "");

      return {
        currentGasInfo: gasInfoResult,
        networkFee: {
          amount: networkFeeAmount,
          denom: GasToken.symbol,
        },
      };
    } catch (error) {
      console.error("Error estimating network fee:", error);
      return {
        currentGasInfo: null,
        networkFee: null,
      };
    }
  };

  return {
    currentGasInfo,
    networkFee,
    isLoading,
    estimateNetworkFee,
  };
};
