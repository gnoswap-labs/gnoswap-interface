import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import {
  TransferGRC20TokenRequest,
  TransferNativeTokenRequest,
} from "@repositories/wallet/request";
import { useEffect, useState } from "react";
import {
  makeBroadcastWithdrawMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { ERROR_VALUE } from "@common/errors/adena";
import { formatPoolPairAmount } from "@utils/new-number-utils";

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
      makeBroadcastWithdrawMessage("pending", {
        tokenSymbol,
        tokenAmount,
      }),
    );

    callAction
      .then(response => {
        if (response.code === 0) {
          broadcastPending(
            makeBroadcastWithdrawMessage(
              "pending",
              {
                tokenSymbol,
                tokenAmount,
              },
              response.data?.hash,
            ),
          );
          setTimeout(() => {
            broadcastSuccess(
              makeBroadcastWithdrawMessage(
                "success",
                {
                  tokenSymbol,
                  tokenAmount,
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
            makeBroadcastWithdrawMessage("error", {
              tokenSymbol,
              tokenAmount,
            }),
          );
          return false;
        } else {
          broadcastError(
            makeBroadcastWithdrawMessage(
              "error",
              {
                tokenSymbol,
                tokenAmount,
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
