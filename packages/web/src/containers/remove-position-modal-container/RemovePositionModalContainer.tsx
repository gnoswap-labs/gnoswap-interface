import { ERROR_VALUE } from "@common/errors/adena";
import RemovePositionModal from "@components/remove/remove-position-modal/RemovePositionModal";
import {
  makeBroadcastRemoveMessage,
  // makeBroadcastUnwrapTokenMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useRemoveData } from "@hooks/stake/use-remove-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { checkGnotPath } from "@utils/common";
import useRouter from "@hooks/common/use-custom-router";
import React, { useCallback, useMemo } from "react";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { GNOT_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";
import { TokenModel } from "@models/token/token-model";

interface RemovePositionModalContainerProps {
  selectedPosition: PoolPositionModel[];
  allPosition: PoolPositionModel[];
  shouldUnwrap: boolean;
}

const RemovePositionModalContainer = ({
  selectedPosition,
  allPosition,
  shouldUnwrap,
}: RemovePositionModalContainerProps) => {
  const { account } = useWallet();
  const { positionRepository } = useGnoswapContext();

  const router = useRouter();
  const clearModal = useClearModal();
  const {
    broadcastRejected,
    broadcastSuccess,
    broadcastLoading,
    broadcastError,
    broadcastPending,
  } = useBroadcastHandler();
  const { pooledTokenInfos, unclaimedRewards } = useRemoveData({
    selectedPosition,
  });

  const onCloseConfirmTransactionModal = useCallback(() => {
    clearModal();
    router.push(router.asPath.replace("/remove", ""));
  }, [clearModal, router]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal(
    {
      closeCallback: onCloseConfirmTransactionModal,
    },
  );

  const gnotToken = useMemo(
    () =>
      selectedPosition.find(item => item.pool.tokenA.path === GNOT_TOKEN.path)
        ?.pool.tokenA,
    [selectedPosition],
  );

  const gnotAmount = useMemo(() => {
    const pooledGnotTokenAmount = pooledTokenInfos.find(
      item => item.token.path === gnotToken?.path,
    )?.amount;
    const unclaimedGnotTokenAmount = unclaimedRewards.find(
      item => item.token.path === gnotToken?.path,
    )?.amount;

    return (
      Number(pooledGnotTokenAmount || 0) + Number(unclaimedGnotTokenAmount || 0)
    );
  }, [gnotToken?.path, pooledTokenInfos, unclaimedRewards]);

  const canUnwrap = useMemo(
    () => shouldUnwrap && !!gnotToken && !!gnotAmount,
    [gnotAmount, gnotToken, shouldUnwrap],
  );

  const tokenTransform = useCallback(
    (token: TokenModel) => {
      if (token.path === GNOT_TOKEN.path) {
        if (canUnwrap) {
          return WUGNOT_TOKEN;
        }
      }

      return token;
    },
    [canUnwrap],
  );

  const onSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }
    const lpTokenIds = selectedPosition.map(position => position.id);
    const approveTokenPaths = [
      ...new Set(
        selectedPosition.flatMap(position => [
          position.pool.tokenA.wrappedPath ||
            checkGnotPath(position.pool.tokenA.path),
          position.pool.tokenB.wrappedPath ||
            checkGnotPath(position.pool.tokenB.path),
        ]),
      ),
    ];

    const messageData = {
      tokenASymbol: tokenTransform(pooledTokenInfos?.[0].token).symbol,
      tokenBSymbol: tokenTransform(pooledTokenInfos?.[1]?.token).symbol,
      tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString("en-US", {
        maximumFractionDigits: 6,
      }),
      tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString("en-US", {
        maximumFractionDigits: 6,
      }),
    };

    broadcastLoading(makeBroadcastRemoveMessage("pending", messageData));

    const result = await positionRepository
      .removeLiquidity({
        lpTokenIds,
        tokenPaths: approveTokenPaths,
        caller: address,
        existWrappedToken: canUnwrap,
      })
      .catch(() => null);

    if (result) {
      if (result.code === 0) {
        broadcastPending();
        await setTimeout(async () => {
          broadcastSuccess(
            makeBroadcastRemoveMessage("success", {
              ...messageData,
            }),
          );
          openTransactionConfirmModal();
        });
      } else if (
        result.code === 4000 &&
        result.type !== ERROR_VALUE.TRANSACTION_REJECTED.type
      ) {
        broadcastPending();
        setTimeout(() => {
          broadcastError(
            makeBroadcastRemoveMessage("error", {
              ...messageData,
            }),
          );
          clearModal();
        }, 1000);
      } else {
        broadcastRejected(
          makeBroadcastRemoveMessage("error", {
            ...messageData,
          }),
        );
      }
    }
  }, [
    account?.address,
    clearModal,
    positionRepository,
    selectedPosition,
    router,
    pooledTokenInfos,
    gnotToken,
    shouldUnwrap,
    canUnwrap,
  ]);

  return (
    <RemovePositionModal
      selectedPosition={selectedPosition}
      allPositions={allPosition}
      close={clearModal}
      onSubmit={onSubmit}
    />
  );
};

export default RemovePositionModalContainer;
