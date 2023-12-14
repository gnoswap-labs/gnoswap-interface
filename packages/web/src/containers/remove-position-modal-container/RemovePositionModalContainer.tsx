import RemovePositionModal from "@components/remove/remove-position-modal/RemovePositionModal";
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
      clearModal();
      router.back();
    }
  }, [account?.address, clearModal, positionRepository, positions, router]);

  return <RemovePositionModal positions={positions} close={close} onSubmit={onSubmit} />;
};

export default RemovePositionModalContainer;
