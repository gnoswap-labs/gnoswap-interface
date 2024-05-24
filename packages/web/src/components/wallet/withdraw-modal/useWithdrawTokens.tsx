import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import {
  TransferGRC20TokenRequest,
  TransferNativeTokenRequest,
} from "@repositories/wallet/request";
import { useEffect, useState } from "react";
import { makeBroadcastWithdrawMessage, useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";

type Request = TransferGRC20TokenRequest | TransferNativeTokenRequest;
export type WithdrawResponse = {
  hash?: string;
  success: boolean;
  code?: number;
} | null;

const useWithdrawTokens = () => {
  const { broadcastLoading, broadcastSuccess, broadcastPending, broadcastError } = useBroadcastHandler();
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
    const tokenAmount = makeDisplayTokenAmount(request.token, request.tokenAmount)?.toString() || "0";
    console.log("🚀 ~ onSubmit ~ tokenAmount:", tokenAmount);

    broadcastLoading(makeBroadcastWithdrawMessage("pending", {
      tokenSymbol,
      tokenAmount
    }));

    callAction
      .then(response => {
        if (response) {
          broadcastPending(makeBroadcastWithdrawMessage("pending", {
            tokenSymbol,
            tokenAmount
          }));
          setTimeout(() => {
            broadcastSuccess(makeBroadcastWithdrawMessage("success", {
              tokenSymbol,
              tokenAmount
            }));
          }, 1000);

          return true;
        }
        broadcastError(makeBroadcastWithdrawMessage("error", {
          tokenSymbol,
          tokenAmount
        }));
        return false;
      })
      .catch(() => {
        broadcastError(makeBroadcastWithdrawMessage("error", {
          tokenSymbol,
          tokenAmount
        }));
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
