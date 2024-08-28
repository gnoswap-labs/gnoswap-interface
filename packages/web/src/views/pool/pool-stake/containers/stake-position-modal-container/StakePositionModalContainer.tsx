import { useCallback, useMemo } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useGetPoolDetailByPath, useGetPoolList } from "@query/pools";
import { DexEvent } from "@repositories/common";
import { formatPoolPairAmount } from "@utils/new-number-utils";

import StakePositionModal from "../../components/stake-position-modal/StakePositionModal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";

interface StakePositionModalContainerProps {
  positions: PoolPositionModel[];
  refetchPositions: () => Promise<void>;
}

const StakePositionModalContainer = ({
  positions,
  refetchPositions,
}: StakePositionModalContainerProps) => {
  const { account } = useWallet();
  const {
    broadcastRejected,
    broadcastSuccess,
    broadcastLoading,
    broadcastError,
  } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  // Refetch functions
  const { refetch: refetchPools } = useGetPoolList();

  const { positionRepository } = useGnoswapContext();
  const router = useCustomRouter();
  const clearModal = useClearModal();
  const { tokenPrices } = useTokenData();
  const poolPath = router.getPoolPath();
  const { data: pool } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
  });

  const { getMessage } = useMessage();

  const onCloseConfirmTransactionModal = useCallback(() => {
    clearModal();
    const pathName = router.pathname;
    if (pathName === "/earn/stake") {
      router.push("/earn?back=q");
    } else {
      router.push(router.asPath.replace("/stake", ""));
    }
  }, [clearModal, router]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal(
    {
      confirmCallback: onCloseConfirmTransactionModal,
    },
  );

  const pooledTokenInfos = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }
    const tokenA = positions[0].pool.tokenA;
    const tokenB = positions[0].pool.tokenB;
    const pooledTokenAAmount = positions.reduce(
      (accum, position) => accum + Number(position.tokenABalance),
      0,
    );
    const pooledTokenBAmount = positions.reduce(
      (accum, position) => accum + Number(position.tokenBBalance),
      0,
    );
    const tokenAAmount = Number(pooledTokenAAmount) || 0;
    const tokenBAmount = Number(pooledTokenBAmount) || 0;
    return [
      {
        token: tokenA,
        amount: tokenAAmount,
      },
      {
        token: tokenB,
        amount: tokenBAmount,
      },
    ];
  }, [positions, tokenPrices]);

  const onSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }
    const lpTokenIds = positions.map(position => position.id.toString());
    const tokenA = pooledTokenInfos?.[0];
    const tokenB = pooledTokenInfos?.[1];
    broadcastLoading(
      getMessage(DexEvent.STAKE, "pending", {
        tokenASymbol: tokenA?.token?.symbol,
        tokenBSymbol: tokenB?.token?.symbol,
        tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
          decimals: tokenA?.token?.decimals,
          isKMB: false,
        }),
        tokenBAmount: formatPoolPairAmount(tokenB.amount, {
          decimals: tokenB?.token?.decimals,
          isKMB: false,
        }),
      }),
    );
    const result = await positionRepository
      .stakePositions({
        lpTokenIds,
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
          action: DexEvent.STAKE,
          visibleEmitResult: true,
          formatData: () => ({
            tokenASymbol: tokenA?.token?.symbol,
            tokenBSymbol: tokenB?.token?.symbol,
            tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
              decimals: tokenA?.token?.decimals,
              isKMB: false,
            }),
            tokenBAmount: formatPoolPairAmount(tokenB.amount, {
              decimals: tokenB?.token?.decimals,
              isKMB: false,
            }),
          }),
          onEmit: async () => {
            refetchPools();
            refetchPositions();
          },
        });
      }
      if (result.code === 0) {
        openTransactionConfirmModal();
        broadcastSuccess(
          getMessage(
            DexEvent.STAKE,
            "success",
            {
              tokenASymbol: tokenA?.token?.symbol,
              tokenBSymbol: tokenB?.token?.symbol,
              tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
                decimals: tokenA?.token?.decimals,
                isKMB: false,
              }),
              tokenBAmount: formatPoolPairAmount(tokenB.amount, {
                decimals: tokenB?.token?.decimals,
                isKMB: false,
              }),
            },
            result.data?.hash,
          ),
        );
      } else if (result.code === ERROR_VALUE.TRANSACTION_REJECTED.status) {
        broadcastRejected(
          getMessage(DexEvent.STAKE, "error", {
            tokenASymbol: tokenA?.token?.symbol,
            tokenBSymbol: tokenB?.token?.symbol,
            tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
              decimals: tokenA?.token?.decimals,
              isKMB: false,
            }),
            tokenBAmount: formatPoolPairAmount(tokenB.amount, {
              decimals: tokenB?.token?.decimals,
              isKMB: false,
            }),
          }),
        );
      } else {
        openTransactionConfirmModal();
        broadcastError(
          getMessage(
            DexEvent.STAKE,
            "error",
            {
              tokenASymbol: tokenA?.token?.symbol,
              tokenBSymbol: tokenB?.token?.symbol,
              tokenAAmount: formatPoolPairAmount(tokenA?.amount, {
                decimals: tokenA?.token?.decimals,
                isKMB: false,
              }),
              tokenBAmount: formatPoolPairAmount(tokenB.amount, {
                decimals: tokenB?.token?.decimals,
                isKMB: false,
              }),
            },
            result.data?.hash,
          ),
        );
      }
    }
    return result;
  }, [account?.address, positionRepository, positions, router]);

  return (
    <StakePositionModal
      positions={positions}
      close={clearModal}
      onSubmit={onSubmit}
      pool={pool}
    />
  );
};

export default StakePositionModalContainer;
