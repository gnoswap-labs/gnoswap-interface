import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { DexEvent } from "@repositories/common";
import { TransferGRC20TokenRequest, TransferNativeTokenRequest } from "@repositories/wallet/request";
import { CommonState, WalletState } from "@states/index";
import { formatPoolPairAmount } from "@utils/new-number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";

type Request = TransferGRC20TokenRequest | TransferNativeTokenRequest;
export type WithdrawResponse = {
  hash?: string;
  success: boolean;
  code?: number;
} | null;

const useSendAsset = () => {
  // ---------- external state / services ----------
  const walletClient = useAtomValue(WalletState.client);
  const { walletRepository } = useGnoswapContext();
  const { enqueueEvent } = useTransactionEventStore();
  const { updateBalances, refetchGrc20Balances } = useTokenData(true);

  // ---------- broadcast helpers ----------
  const { broadcastLoading, broadcastSuccess, broadcastError, broadcastRejected } = useBroadcastHandler();
  const { getMessage } = useMessage();

  // ---------- local ui state ----------
  const [loading, setLoading] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [result, setResult] = useState<WithdrawResponse>(null);
  const openedTransactionModal = useAtomValue(CommonState.openedTransactionModal);

  // --------------------
  // Helper : TokenInfo builder
  // --------------------
  const buildTokenInfo = useCallback((request: Request) => {
    const tokenSymbol = request?.token?.symbol || "";
    const tokenAmount = formatPoolPairAmount(
      makeDisplayTokenAmount(request.token, request.tokenAmount)?.toString() || "0",
      {
        decimals: request.token.decimals,
        isKMB: false,
      },
    );
    return { tokenSymbol, tokenAmount };
  }, []);

  // --------------------
  // Helper : Wallet action builder
  // --------------------
  const buildWalletAction = useCallback(
    (request: Request, type: "Native" | "GRC20") => {
      return type === "Native"
        ? walletRepository.transferGNOTToken(request)
        : walletRepository.transferGRC20Token(request);
    },
    [walletRepository],
  );

  const onSubmit = async (request: Request, type: "Native" | "GRC20") => {
    setLoading(true);

    const walletType = walletClient?.getWalletType();
    const { tokenSymbol, tokenAmount } = buildTokenInfo(request);

    if (walletType === "ADENA") {
      broadcastLoading(
        getMessage(DexEvent.ASSET_SEND, "pending", {
          tokenASymbol: tokenSymbol,
          tokenAAmount: tokenAmount,
        }),
      );
    }

    try {
      const response = await buildWalletAction(request, type);

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
            { tokenASymbol: tokenSymbol, tokenAAmount: tokenAmount },
            response.data?.hash,
          ),
        );
        return true;
      }

      if (response.code === ERROR_VALUE.TRANSACTION_REJECTED.status) {
        broadcastRejected(
          getMessage(DexEvent.ASSET_SEND, "error", {
            tokenASymbol: tokenSymbol,
            tokenAAmount: tokenAmount,
          }),
        );
        return false;
      }

      broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
      return false;
    } catch (err) {
      console.log("TransferToken Error: ", err);
      broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
      return false;
    } finally {
      setLoading(false);
    }
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
