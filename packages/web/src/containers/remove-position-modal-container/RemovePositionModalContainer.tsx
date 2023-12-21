import RemovePositionModal from "@components/remove/remove-position-modal/RemovePositionModal";
import {
  makeBroadcastRemovePositionMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import BigNumber from "bignumber.js";
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
    broadcastLoading,
    broadcastRejected,
    broadcastSuccess,
    broadcastPending,
    broadcastError,
  } = useBroadcastHandler();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const moveToBack = useCallback(() => {
    close();
    router.back();
  }, [close, router]);

  const onSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }

    const [
      {
        token0Balance,
        token1Balance,
        pool: { tokenA, tokenB },
      },
    ] = positions;

    const broadcastPayload = {
      tokenASymbol: tokenA.symbol,
      tokenBSymbol: tokenB.symbol,
      tokenAAmount: BigNumber(token0Balance.toString())
        .shiftedBy(-tokenA.decimals)
        ?.toString(),
      tokenBAmount: BigNumber(token1Balance.toString())
        .shiftedBy(-tokenA.decimals)
        ?.toString(),
    };
    broadcastLoading(
      makeBroadcastRemovePositionMessage("pending", broadcastPayload),
    );

    const lpTokenIds = positions.map(position => position.id);
    return positionRepository
      .removeLiquidity({
        lpTokenIds,
        caller: address,
      })
      .then(result => {
        if (result) {
          if (result.code === 0) {
            broadcastPending();
            setTimeout(() => {
              broadcastSuccess(
                makeBroadcastRemovePositionMessage("success", broadcastPayload),
                moveToBack,
              );
            }, 500);
            return true;
          } else if (result.code === 4000) {
            broadcastRejected(
              makeBroadcastRemovePositionMessage("error", broadcastPayload),
            );
            return true;
          }
        }
        return false;
      })
      .catch(() => false)
      .then(broadcasted => {
        if (broadcasted) {
          return;
        }
        broadcastError(
          makeBroadcastRemovePositionMessage("error", broadcastPayload),
        );
      });
  }, [
    account?.address,
    broadcastError,
    broadcastLoading,
    broadcastPending,
    broadcastRejected,
    broadcastSuccess,
    moveToBack,
    positionRepository,
    positions,
  ]);

  return (
    <RemovePositionModal
      positions={positions}
      close={close}
      onSubmit={onSubmit}
    />
  );
};

export default RemovePositionModalContainer;
