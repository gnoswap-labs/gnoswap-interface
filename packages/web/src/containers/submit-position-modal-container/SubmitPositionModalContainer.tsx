import React, { useCallback, useMemo } from "react";
import SubmitPositionModal from "@components/stake/submit-position-modal/SubmitPositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import useRouter from "@hooks/common/use-custom-router";
import {
  makeBroadcastStakingMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { ERROR_VALUE } from "@common/errors/adena";
import { useTokenData } from "@hooks/token/use-token-data";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useGetPoolDetailByPath } from "@query/pools";

interface SubmitPositionModalContainerProps {
  positions: PoolPositionModel[];
}

const SubmitPositionModalContainer = ({
  positions,
}: SubmitPositionModalContainerProps) => {
  const { account } = useWallet();
  const {
    broadcastRejected,
    broadcastSuccess,
    broadcastLoading,
    broadcastError,
    broadcastPending,
  } = useBroadcastHandler();
  const { positionRepository } = useGnoswapContext();
  const router = useRouter();
  const clearModal = useClearModal();
  const { tokenPrices } = useTokenData();
  const poolPath = router.query["pool-path"] as string;
  const { data: pool } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath
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

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal({
    confirmCallback: onCloseConfirmTransactionModal,
  });


  const pooledTokenInfos = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }
    const tokenA = positions[0].pool.tokenA;
    const tokenB = positions[0].pool.tokenB;
    const pooledTokenAAmount = positions.reduce(
      (accum, position) => accum + position.tokenABalance,
      0,
    );
    const pooledTokenBAmount = positions.reduce(
      (accum, position) => accum + position.tokenBBalance,
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
    broadcastLoading(
      makeBroadcastStakingMessage("pending", {
        tokenASymbol: pooledTokenInfos?.[0]?.token?.symbol,
        tokenBSymbol: pooledTokenInfos?.[1]?.token?.symbol,
        tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString("en-US", {
          maximumFractionDigits: 6,
        }),
        tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString("en-US", {
          maximumFractionDigits: 6,
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
        broadcastPending();
        setTimeout(() => {
          broadcastSuccess(
            makeBroadcastStakingMessage("success", {
              tokenASymbol: pooledTokenInfos?.[0]?.token?.symbol,
              tokenBSymbol: pooledTokenInfos?.[1]?.token?.symbol,
              tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString(
                "en-US",
                { maximumFractionDigits: 6 },
              ),
              tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString(
                "en-US",
                { maximumFractionDigits: 6 },
              ),
            }),
          );
        }, 1000);
        openTransactionConfirmModal();

      } else if (
        result.code === 4000 &&
        result.type !== ERROR_VALUE.TRANSACTION_REJECTED.type
      ) {
        broadcastError(
          makeBroadcastStakingMessage("error", {
            tokenASymbol: pooledTokenInfos?.[0]?.token?.symbol,
            tokenBSymbol: pooledTokenInfos?.[1]?.token?.symbol,
            tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString(
              "en-US",
              { maximumFractionDigits: 6 },
            ),
            tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString(
              "en-US",
              { maximumFractionDigits: 6 },
            ),
          }),
        );
      } else {
        broadcastRejected(
          makeBroadcastStakingMessage("error", {
            tokenASymbol: pooledTokenInfos?.[0]?.token?.symbol,
            tokenBSymbol: pooledTokenInfos?.[1]?.token?.symbol,
            tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString(
              "en-US",
              { maximumFractionDigits: 6 },
            ),
            tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString(
              "en-US",
              { maximumFractionDigits: 6 },
            ),
          }),
        );
      }
    }
    return result;
  }, [account?.address, positionRepository, positions, router]);

  return (
    <SubmitPositionModal
      positions={positions}
      close={clearModal}
      onSubmit={onSubmit}
      pool={pool}
    />
  );
};

export default SubmitPositionModalContainer;
