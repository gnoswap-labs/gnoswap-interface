import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { PoolPositionModel } from "@models/position/pool-position-model";
import { CommonState } from "@states/index";

import RemovePositionModalContainer from "../../../layouts/pool/pool-remove/containers/remove-position-modal-container/RemovePositionModalContainer";

export interface Props {
  positions: PoolPositionModel[];
  selectedIds: number[];
  positionLiquidities: Record<string, BigNumber>;
  refetchPositions: () => Promise<void>;
}

export const useRemovePositionModal = ({ positions, selectedIds, positionLiquidities, refetchPositions }: Props) => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const selectedPositions = useMemo(() => {
    return positions.filter(position => selectedIds.includes(position.id));
  }, [positions, selectedIds]);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(
      <RemovePositionModalContainer
        allPosition={positions}
        selectedPositions={selectedPositions}
        positionLiquidities={positionLiquidities}
        refetchPositions={refetchPositions}
      />,
    );
  }, [positions, selectedPositions, setModalContent, setOpenedModal, refetchPositions]);

  return {
    openModal,
  };
};
