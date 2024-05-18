import { ERROR_VALUE } from "@common/errors/adena";
import RemovePositionModal from "@components/remove/remove-position-modal/RemovePositionModal";
import {
  makeBroadcastRemoveMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useRemoveData } from "@hooks/stake/use-remove-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { checkGnotPath } from "@utils/common";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

interface RemovePositionModalContainerProps {
  positions: PoolPositionModel[];
}

const RemovePositionModalContainer = ({
  positions,
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
  const { pooledTokenInfos } = useRemoveData({ positions });

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }
    const lpTokenIds = positions.map(position => position.id);
    const approveTokenPaths = [
      ...new Set(
        positions.flatMap(position => [
          position.pool.tokenA.wrappedPath ||
            checkGnotPath(position.pool.tokenA.path),
          position.pool.tokenB.wrappedPath ||
            checkGnotPath(position.pool.tokenB.path),
        ]),
      ),
    ];

    broadcastLoading(
      makeBroadcastRemoveMessage("pending", {
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
      .removeLiquidity({
        lpTokenIds,
        tokenPaths: approveTokenPaths,
        caller: address,
      })
      .catch(() => null);
    if (result) {
      if (result.code === 0) {
        broadcastPending();
        setTimeout(() => {
          broadcastSuccess(
            makeBroadcastRemoveMessage("success", {
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
          router.push(router.asPath.replace("/remove", ""));
          clearModal();
        }, 1000);
      } else if (
        result.code === 4000 &&
        result.type !== ERROR_VALUE.TRANSACTION_REJECTED.type
      ) {
        broadcastPending();
        setTimeout(() => {
          broadcastError(
            makeBroadcastRemoveMessage("error", {
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
          clearModal();
        }, 1000);
      } else {
        broadcastRejected(
          makeBroadcastRemoveMessage("error", {
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
  }, [account?.address, clearModal, positionRepository, positions, router]);

  return (
    <RemovePositionModal
      positions={positions}
      close={close}
      onSubmit={onSubmit}
    />
  );
};

export default RemovePositionModalContainer;
