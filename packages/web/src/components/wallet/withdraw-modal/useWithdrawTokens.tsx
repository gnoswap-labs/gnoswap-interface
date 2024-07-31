import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import {
  TransferGRC20TokenRequest,
  TransferNativeTokenRequest,
} from "@repositories/wallet/request";
import { useEffect, useState } from "react";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { ERROR_VALUE } from "@common/errors/adena";
import { formatPoolPairAmount } from "@utils/new-number-utils";
import { useMessage } from "@hooks/common/use-message";

type Request = TransferGRC20TokenRequest | TransferNativeTokenRequest;
export type WithdrawResponse = {
  hash?: string;
  success: boolean;
  code?: number;
} | null;

const useWithdrawTokens = () => {
  const {
    broadcastLoading,
    broadcastSuccess,
    broadcastPending,
    broadcastError,
    broadcastRejected,
  } = useBroadcastHandler();
  const { walletRepository } = useGnoswapContext();

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
      getMessage("WITHDRAW", "pending", {
        tokenASymbol: tokenSymbol,
        tokenAAmount: tokenAmount,
      }),
    );

    callAction
      .then(response => {
        if (response.code === 0) {
          broadcastPending(
            getMessage(
              "WITHDRAW",
              "pending",
              {
                tokenASymbol: tokenSymbol,
                tokenAAmount: tokenAmount,
              },
              response.data?.hash,
            ),
          );
          setTimeout(() => {
            broadcastSuccess(
              getMessage(
                "WITHDRAW",
                "success",
                {
                  tokenASymbol: tokenSymbol,
                  tokenAAmount: tokenAmount,
                },
                response.data?.hash,
              ),
            );
          }, 1000);
          return true;
        } else if (
          response.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
        ) {
          broadcastRejected(
            getMessage("WITHDRAW", "error", {
              tokenASymbol: tokenSymbol,
              tokenAAmount: tokenAmount,
            }),
          );
          return false;
        } else {
          broadcastError(
            getMessage(
              "WITHDRAW",
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

export default useWithdrawTokens;
