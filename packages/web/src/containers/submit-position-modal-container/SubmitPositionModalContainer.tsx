import React, { useCallback } from "react";
import SubmitPositionModal from "@components/stake/submit-position-modal/SubmitPositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";

interface SubmitPositionModalContainerProps {
  positions: PoolPositionModel[];
}

const SubmitPositionModalContainer = ({
  positions
}: SubmitPositionModalContainerProps) => {
  const { account } = useWallet();
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
      clearModal();
      router.back();
    }
    return result;
  }, [account?.address, clearModal, positionRepository, positions, router]);

  return <SubmitPositionModal positions={positions} close={close} onSubmit={onSubmit} />;
};

export default SubmitPositionModalContainer;
