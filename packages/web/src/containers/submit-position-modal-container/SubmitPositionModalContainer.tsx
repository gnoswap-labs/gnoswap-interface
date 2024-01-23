import React, { useCallback } from "react";
import SubmitPositionModal from "@components/stake/submit-position-modal/SubmitPositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";
import { makeBroadcastStakingMessage, useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { ERROR_VALUE } from "@common/errors/adena";

interface SubmitPositionModalContainerProps {
  positions: PoolPositionModel[];
}

const SubmitPositionModalContainer = ({
  positions
}: SubmitPositionModalContainerProps) => {
  const { account } = useWallet();
  const { broadcastRejected, broadcastSuccess, broadcastPending, broadcastError } = useBroadcastHandler();
  const { positionRepository } = useGnoswapContext();
  const router = useRouter();
  const clearModal = useClearModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }
    const lpTokenIds = positions.map(position => position.id);
    const result = await positionRepository.stakePositions({
      lpTokenIds,
      caller: address
    }).catch(() => null);
    if (result) {
      if (result.code === 0) {
        broadcastPending();
        setTimeout(() => {
          broadcastSuccess(makeBroadcastStakingMessage("success"));
          
        }, 1000);
        const pathName = router.pathname;
        if (pathName === "/earn/stake") {
          router.push("/earn?back=q");
        } else {
          router.push(router.asPath.replace("/stake", ""));
        }
      } else if (result.code === 4000 && result.type !== ERROR_VALUE.TRANSACTION_REJECTED.type) {
        broadcastError(makeBroadcastStakingMessage("error"));
      } else {
        broadcastRejected(makeBroadcastStakingMessage("error"));
      }
    }
    return result;
  }, [account?.address, clearModal, positionRepository, positions, router]);

  return <SubmitPositionModal positions={positions} close={close} onSubmit={onSubmit} />;
};

export default SubmitPositionModalContainer;
