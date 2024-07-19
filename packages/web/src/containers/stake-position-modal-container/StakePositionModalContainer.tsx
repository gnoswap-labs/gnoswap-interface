import React, { useCallback, useMemo } from "react";
import StakePositionModal from "@components/stake/stake-position-modal/StakePositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import useCustomRouter from "@hooks/common/use-custom-router";
import {
  makeBroadcastStakingMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { ERROR_VALUE } from "@common/errors/adena";
import { useTokenData } from "@hooks/token/use-token-data";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useGetPoolDetailByPath } from "@query/pools";

interface StakePositionModalContainerProps {
  positions: PoolPositionModel[];
}

const StakePositionModalContainer = ({
  positions,
}: StakePositionModalContainerProps) => {
  const { account } = useWallet();
  const {
    broadcastRejected,
    broadcastSuccess,
    broadcastLoading,
    broadcastError,
    broadcastPending,
  } = useBroadcastHandler();
  const { positionRepository } = useGnoswapContext();
  const router = useCustomRouter();
  const clearModal = useClearModal();
  const { tokenPrices } = useTokenData();
  const poolPath = router.getPoolPath();
  const { data: pool } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
  });

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
    const lpTokenIds = positions.map(position => position.id);
    const tokenA = pooledTokenInfos?.[0];
    const tokenB = pooledTokenInfos?.[1];
    broadcastLoading(
      makeBroadcastStakingMessage("pending", {
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
      .stakePositions({
        lpTokenIds,
        caller: address,
      })
      .catch(() => null);

    if (result) {
      if (result.code === 0) {
        broadcastPending({ txHash: result.data?.hash });
        setTimeout(() => {
          broadcastSuccess(
            makeBroadcastStakingMessage(
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
        }, 1000);
        openTransactionConfirmModal();
      } else if (result.code === ERROR_VALUE.TRANSACTION_REJECTED.status) {
        broadcastRejected(
          makeBroadcastStakingMessage("error", {
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
      } else {
        broadcastError(
          makeBroadcastStakingMessage(
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
