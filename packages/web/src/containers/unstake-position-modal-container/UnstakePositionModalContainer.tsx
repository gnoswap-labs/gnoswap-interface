import React, { useCallback } from "react";
import UnstakePositionModal from "@components/unstake/unstake-position-modal/UnstakePositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useRouter } from "next/router";
import {
  makeBroadcastUnstakeMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import BigNumber from "bignumber.js";

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

  const [
    {
      pool: { tokenA, tokenB },
      token0Balance,
      token1Balance,
    },
  ] = positions || [];

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

  const onSubmit = useCallback(() => {
    const address = account?.address;
    if (!address || !tokenA || !tokenB) {
      return null;
    }

    const broadcastPayload = {
      tokenASymbol: tokenA.symbol,
      tokenBSymbol: tokenB.symbol,
      tokenAAmount: BigNumber(token0Balance?.toString())
        .shiftedBy(-tokenA.decimals)
        ?.toString(),
      tokenBAmount: BigNumber(token1Balance?.toString())
        .shiftedBy(-tokenA.decimals)
        ?.toString(),
    };
    const lpTokenIds = positions.map(position => position.id);
    broadcastLoading(makeBroadcastUnstakeMessage("pending", broadcastPayload));

    positionRepository
      .unstakePositions({
        lpTokenIds,
        caller: address,
      })
      .then(result => {
        if (result) {
          if (result.code === 0) {
            broadcastPending();
            setTimeout(() => {
              broadcastSuccess(
                makeBroadcastUnstakeMessage("success", broadcastPayload),
                moveToBack,
              );
            }, 500);
            return true;
          } else if (result.code === 4000) {
            broadcastRejected(
              makeBroadcastUnstakeMessage("error", broadcastPayload),
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
        broadcastError(makeBroadcastUnstakeMessage("error", broadcastPayload));
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
    token0Balance,
    token1Balance,
    tokenA,
    tokenB,
  ]);

  return (
    <UnstakePositionModal
      positions={positions}
      close={close}
      onSubmit={onSubmit}
    />
  );
};

export default UnstakePositionModalContainer;
