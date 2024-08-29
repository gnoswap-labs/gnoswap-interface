import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { DexEvent } from "@repositories/common";
import {
  TransferGRC20TokenRequest,
  TransferNativeTokenRequest,
} from "@repositories/wallet/request";
import { CommonState } from "@states/index";
import { formatPoolPairAmount } from "@utils/new-number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useTokenData } from "@hooks/token/use-token-data";

type Request = TransferGRC20TokenRequest | TransferNativeTokenRequest;
export type WithdrawResponse = {
  hash?: string;
  success: boolean;
  code?: number;
} | null;

const useSendAsset = () => {
  const { walletRepository } = useGnoswapContext();
  const {
    broadcastLoading,
    broadcastSuccess,
    broadcastError,
    broadcastRejected,
  } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  // Refetch functions
  const { updateBalances } = useTokenData();

  const [loading, setLoading] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [result, setResult] = useState<WithdrawResponse>(null);
  const [openedTransactionModal] = useAtom(CommonState.openedTransactionModal);

  const { getMessage } = useMessage();

  const onSubmit = async (request: Request, type: "native" | "grc20") => {
    setLoading(true);

    const callAction =
      type === "native"
        ? walletRepository.transferGNOTToken(request)
        : walletRepository.transferGRC20Token(request);

    const tokenSymbol = request?.token?.symbol || "";
    const tokenAmount = formatPoolPairAmount(
      makeDisplayTokenAmount(request.token, request.tokenAmount)?.toString() ||
        "0",
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
        if (
          response.code === 0 ||
          response.code === ERROR_VALUE.TRANSACTION_FAILED.status
        ) {
          enqueueEvent({
            txHash: response.data?.hash,
            action: DexEvent.ASSET_SEND,
            formatData: () => ({
              tokenASymbol: tokenSymbol,
              tokenAAmount: tokenAmount,
            }),
            onUpdate: async () => {
              updateBalances();
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
          broadcastError(
            getMessage(
              DexEvent.ASSET_SEND,
              "error",
              {
                tokenASymbol: tokenSymbol,
                tokenAAmount: tokenAmount,
              },
              response.data?.hash,
            ),
          );
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
