import React, { useCallback } from "react";
import UnstakePositionModal from "@components/unstake/unstake-position-modal/UnstakePositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useRouter } from "next/router";

interface UnstakePositionModalContainerProps {
  positions: PoolPositionModel[];
}

const UnstakePositionModalContainer = ({
  positions
}: UnstakePositionModalContainerProps) => {
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
    const result = await positionRepository.unstakePositions({
      lpTokenIds,
      caller: address
    }).catch(() => null);
    if (result) {
      clearModal();
      router.back();
    }
    return result;
  }, [account?.address, clearModal, positionRepository, positions, router]);

  return <UnstakePositionModal positions={positions} close={close} onSubmit={onSubmit} />;
};

export default UnstakePositionModalContainer;
