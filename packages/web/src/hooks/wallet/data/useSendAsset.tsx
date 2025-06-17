import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { DexEvent } from "@repositories/common";
import { TransferGRC20TokenRequest, TransferNativeTokenRequest } from "@repositories/wallet/request";
import { CommonState } from "@states/index";
import { formatPoolPairAmount } from "@utils/new-number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { makeTransferGNOTTokenMessages, makeTransferGRC20TokenMessages } from "@repositories/wallet/wallet.message";
import { useNetworkFee } from "@hooks/common/use-network-fee";

type Request = TransferGRC20TokenRequest | TransferNativeTokenRequest;
export type WithdrawResponse = {
  hash?: string;
  success: boolean;
  code?: number;
} | null;

const useSendAsset = () => {
  const { walletRepository, transactionService } = useGnoswapContext();
  const { broadcastLoading, broadcastSuccess, broadcastError, broadcastRejected } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  // Refetch functions
  const { updateBalances, refetchGrc20Balances } = useTokenData();

  const { estimateNetworkFee } = useNetworkFee(null);

  const [loading, setLoading] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [result, setResult] = useState<WithdrawResponse>(null);
  const [openedTransactionModal] = useAtom(CommonState.openedTransactionModal);

  const { getMessage } = useMessage();

  const onSubmit = async (request: Request, type: "Native" | "GRC20") => {
    setLoading(true);
    const isNativeTransfer = type === "Native";

    const transactionMessage = isNativeTransfer
      ? makeTransferGNOTTokenMessages({ ...request })
      : makeTransferGRC20TokenMessages({ ...request });
    const transactionDocument = await transactionService.createDocument({ messages: transactionMessage });
    await transactionService.createTransaction(transactionDocument);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(transactionDocument);

    const requestWithGasInfo = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: currentGasInfo?.gasUsed.toString(),
    };

    const callAction =
      type === "Native"
        ? walletRepository.transferGNOTToken(requestWithGasInfo)
        : walletRepository.transferGRC20Token(requestWithGasInfo);

    const tokenSymbol = request?.token?.symbol || "";
    const tokenAmount = formatPoolPairAmount(
      makeDisplayTokenAmount(request.token, request.tokenAmount)?.toString() || "0",
      {
        decimals: request.token.decimals,
        isKMB: false,
      },
    );

    broadcastLoading(
      getMessage(DexEvent.ASSET_SEND, "pending", {
        tokenASymbol: tokenSymbol,
        tokenAAmount: tokenAmount,
      }),
    );

    callAction
      .then(response => {
        if (response.code === 0 || response.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
          enqueueEvent({
            txHash: response.data?.hash,
            action: DexEvent.ASSET_SEND,
            formatData: () => ({
              tokenASymbol: tokenSymbol,
              tokenAAmount: tokenAmount,
            }),
            onUpdate: async () => {
              await refetchGrc20Balances();
              await updateBalances();
            },
            onEmit: async () => {
              await refetchGrc20Balances();
            },
          });
        }

        if (response.code === 0) {
          broadcastSuccess(
            getMessage(
              DexEvent.ASSET_SEND,
              "success",
              {
                tokenASymbol: tokenSymbol,
                tokenAAmount: tokenAmount,
              },
              response.data?.hash,
            ),
          );
          return true;
        } else if (
          response.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
        ) {
          broadcastRejected(
            getMessage(DexEvent.ASSET_SEND, "error", {
              tokenASymbol: tokenSymbol,
              tokenAAmount: tokenAmount,
            }),
          );
          return false;
        } else {
          broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
          return false;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!openedTransactionModal) {
      setIsConfirm(false);
    }
  }, [openedTransactionModal]);

  return {
    onSubmit,
    setIsConfirm,
    isConfirm,
    result,
    loading,
    setResult,
  };
};

export default useSendAsset;
