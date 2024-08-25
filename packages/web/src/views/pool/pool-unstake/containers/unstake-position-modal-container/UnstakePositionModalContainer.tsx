import { useCallback } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { DexEvent } from "@repositories/common";
import { formatPoolPairAmount } from "@utils/new-number-utils";

import { usePositionsRewards } from "../../../common/hooks/use-positions-rewards";
import UnstakePositionModal from "../../components/unstake-position-modal/UnstakePositionModal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useGetPoolList } from "@query/pools";
import { useGetPositionsByAddress } from "@query/positions";

interface UnstakePositionModalContainerProps {
  positions: PoolPositionModel[];
  isGetWGNOT: boolean;
}

const UnstakePositionModalContainer = ({
  positions,
  isGetWGNOT,
}: UnstakePositionModalContainerProps) => {
  const { account } = useWallet();
  const { positionRepository } = useGnoswapContext();
  const router = useRouter();
  const clearModal = useClearModal();
  const {
    broadcastRejected,
    broadcastSuccess,
    broadcastError,
    broadcastLoading,
  } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  // Refetch functions
  const { refetch: refetchPools } = useGetPoolList();
  const { refetch: refetchPositions } = useGetPositionsByAddress();

  const { pooledTokenInfos } = usePositionsRewards({ positions });
  const { openModal } = useTransactionConfirmModal({
    confirmCallback: () => router.push(router.asPath.replace("/unstake", "")),
  });

  const { getMessage } = useMessage();

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
      getMessage(DexEvent.UNSTAKE, "pending", {
        tokenASymbol: tokenA?.token?.symbol,
        tokenBSymbol: tokenB?.token?.symbol,
        tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
          decimals: tokenA?.token?.decimals,
          isKMB: false,
        }),
        tokenBAmount: formatPoolPairAmount(tokenB?.amount, {
          decimals: tokenA?.token?.decimals,
          isKMB: false,
        }),
      }),
    );
    const result = await positionRepository
      .unstakePositions({
        positions,
        isGetWGNOT,
        caller: address,
      })
      .catch(() => null);
    if (result) {
      if (
        result.code === 0 ||
        result.code === ERROR_VALUE.TRANSACTION_FAILED.status
      ) {
        enqueueEvent({
          txHash: result.data?.hash,
          action: DexEvent.UNSTAKE,
          formatData: () => ({
            tokenASymbol: tokenA?.token?.symbol,
            tokenBSymbol: tokenB?.token?.symbol,
            tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
              decimals: tokenA?.token?.decimals,
              isKMB: false,
            }),
            tokenBAmount: formatPoolPairAmount(tokenB?.amount, {
              decimals: tokenA?.token?.decimals,
              isKMB: false,
            }),
          }),
          callback: async () => {
            refetchPools();
            refetchPositions();
          },
        });
      }
      if (result.code === 0) {
        setTimeout(() => {
          broadcastSuccess(
            getMessage(
              DexEvent.UNSTAKE,
              "success",
              {
                tokenASymbol: tokenA?.token?.symbol,
                tokenBSymbol: tokenB?.token?.symbol,
                tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
                  decimals: tokenA?.token?.decimals,
                  isKMB: false,
                }),
                tokenBAmount: formatPoolPairAmount(tokenB?.amount, {
                  decimals: tokenA?.token?.decimals,
                  isKMB: false,
                }),
              },
              result.data?.hash,
            ),
          );
          openModal();
        }, 1000);
      } else if (result.code === ERROR_VALUE.TRANSACTION_REJECTED.status) {
        broadcastRejected(
          getMessage(DexEvent.UNSTAKE, "error", {
            tokenASymbol: tokenA?.token?.symbol,
            tokenBSymbol: tokenB?.token?.symbol,
            tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
              decimals: tokenA?.token?.decimals,
              isKMB: false,
            }),
            tokenBAmount: formatPoolPairAmount(tokenB?.amount, {
              decimals: tokenA?.token?.decimals,
              isKMB: false,
            }),
          }),
        );
        openModal();
      } else {
        broadcastError(
          getMessage(
            DexEvent.UNSTAKE,
            "error",
            {
              tokenASymbol: tokenA?.token?.symbol,
              tokenBSymbol: tokenB?.token?.symbol,
              tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
                decimals: tokenA?.token?.decimals,
                isKMB: false,
              }),
              tokenBAmount: formatPoolPairAmount(tokenB?.amount, {
                decimals: tokenA?.token?.decimals,
                isKMB: false,
              }),
            },
            result.data?.hash,
          ),
        );
        openModal();
      }
    }
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
