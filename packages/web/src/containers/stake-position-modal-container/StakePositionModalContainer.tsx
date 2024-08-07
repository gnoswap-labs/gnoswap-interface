import { useCallback, useMemo } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import StakePositionModal from "@components/stake/stake-position-modal/StakePositionModal";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useGetPoolDetailByPath } from "@query/pools";
import { DexEvent } from "@repositories/common";

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
    const lpTokenIds = positions.map(position => position.id);
    const tokenA = pooledTokenInfos?.[0];
    const tokenB = pooledTokenInfos?.[1];
    broadcastLoading(
      getMessage(DexEvent.STAKE, "pending", {
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
            getMessage(
              DexEvent.STAKE,
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
          getMessage(DexEvent.STAKE, "error", {
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
          getMessage(
            DexEvent.STAKE,
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
