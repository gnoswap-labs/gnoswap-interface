import React, { useCallback } from "react";
import UnstakePositionModal from "@components/unstake/unstake-position-modal/UnstakePositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import useRouter from "@hooks/common/use-custom-router";
import {
  makeBroadcastUnStakingMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { useUnstakeData } from "@hooks/stake/use-unstake-data";
import { ERROR_VALUE } from "@common/errors/adena";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";

interface UnstakePositionModalContainerProps {
  positions: PoolPositionModel[];
}

const UnstakePositionModalContainer = ({
  positions,
}: UnstakePositionModalContainerProps) => {
  const { account } = useWallet();
  const { positionRepository } = useGnoswapContext();
  const router = useRouter();
  const clearModal = useClearModal();
  const {
    broadcastRejected,
    broadcastSuccess,
    broadcastPending,
    broadcastError,
    broadcastLoading,
  } = useBroadcastHandler();
  const { pooledTokenInfos } = useUnstakeData({ positions });
  const { openModal } = useTransactionConfirmModal({
    confirmCallback: () => router.push(router.asPath.replace("/unstake", "")),
  });

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const unstakeOnSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }

    const tokenA = pooledTokenInfos?.[0];
    const tokenB = pooledTokenInfos?.[1];

    broadcastLoading(
      makeBroadcastUnStakingMessage("pending", {
        tokenASymbol: tokenA?.token?.symbol,
        tokenBSymbol: tokenB?.token?.symbol,
        tokenAAmount: tokenA?.amount.toLocaleString("en-US", {
          maximumFractionDigits: tokenA?.token?.decimals,
        }),
        tokenBAmount: tokenB?.amount.toLocaleString("en-US", {
          maximumFractionDigits: tokenB?.token?.decimals,
        }),
      }),
    );
    const result = await positionRepository
      .unstakePositions({
        positions,
        caller: address,
      })
      .catch(() => null);
    if (result) {
      if (result.code === 0) {
        broadcastPending({ txHash: result.data?.hash });
        setTimeout(() => {
          broadcastSuccess(
            makeBroadcastUnStakingMessage(
              "success",
              {
                tokenASymbol: tokenA?.token?.symbol,
                tokenBSymbol: tokenB?.token?.symbol,
                tokenAAmount: tokenA?.amount.toLocaleString("en-US", {
                  maximumFractionDigits: tokenA?.token?.decimals,
                }),
                tokenBAmount: tokenB?.amount.toLocaleString("en-US", {
                  maximumFractionDigits: tokenB?.token?.decimals,
                }),
              },
              result.data?.hash,
            ),
          );
          openModal();
          // router.push(router.asPath.replace("/unstake", ""));
        }, 1000);
      } else if (
        result.code === ERROR_VALUE.TRANSACTION_REJECTED.status
      ) {
        broadcastRejected(
          makeBroadcastUnStakingMessage("error", {
            tokenASymbol: tokenA?.token?.symbol,
            tokenBSymbol: tokenB?.token?.symbol,
            tokenAAmount: tokenA?.amount.toLocaleString(
              "en-US",
              { maximumFractionDigits: tokenA?.token?.decimals },
            ),
            tokenBAmount: tokenB?.amount.toLocaleString(
              "en-US",
              { maximumFractionDigits: tokenB?.token?.decimals },
            ),
          }),
        );
        openModal();
      } else {
        broadcastError(
          makeBroadcastUnStakingMessage(
            "error",
            {
              tokenASymbol: tokenA?.token?.symbol,
              tokenBSymbol: tokenB?.token?.symbol,
              tokenAAmount: tokenA?.amount.toLocaleString("en-US", {
                maximumFractionDigits: tokenA?.token?.decimals,
              }),
              tokenBAmount: tokenB?.amount.toLocaleString("en-US", {
                maximumFractionDigits: tokenB?.token?.decimals,
              }),
            },
            result.data?.hash,
          ),
        );
        openModal();
      }
    }
    // if (result) {
    //   clearModal();
    //   router.push(router.asPath.replace("/unstake", ""));
    // }
    return result;
  }, [account?.address, positionRepository, positions, router]);

  return (
    <UnstakePositionModal
      positions={positions}
      close={close}
      onSubmit={unstakeOnSubmit}
    />
  );
};

export default UnstakePositionModalContainer;
