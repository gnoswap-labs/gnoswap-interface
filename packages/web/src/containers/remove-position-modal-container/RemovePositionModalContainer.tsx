import { ERROR_VALUE } from "@common/errors/adena";
import RemovePositionModal from "@components/remove/remove-position-modal/RemovePositionModal";
import { makeBroadcastRemoveMessage, useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
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
  const { broadcastRejected, broadcastSuccess, broadcastPending, broadcastError } = useBroadcastHandler();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }
    const lpTokenIds = positions.map(position => position.id);
    const result = await positionRepository.removeLiquidity({
      lpTokenIds,
      caller: address
    }).catch(() => null);
    if (result) {
      if (result.code === 0) {
        broadcastPending();
        setTimeout(() => {
          broadcastSuccess(makeBroadcastRemoveMessage("success"));
          router.push(router.asPath.replace("/remove", ""));
          clearModal();
        }, 1000);
      } else if (result.code === 4000 && result.type !== ERROR_VALUE.TRANSACTION_REJECTED.type) {
        broadcastPending();
        setTimeout(() => {
          broadcastError(makeBroadcastRemoveMessage("error"));
          clearModal();
        }, 1000);
      } else {
        broadcastRejected(makeBroadcastRemoveMessage("error"));
      }
    }
  }, [account?.address, clearModal, positionRepository, positions, router]);

  return <RemovePositionModal positions={positions} close={close} onSubmit={onSubmit} />;
};

export default RemovePositionModalContainer;
