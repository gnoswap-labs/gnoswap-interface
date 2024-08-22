import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { PoolPositionModel } from "@models/position/pool-position-model";
import { CommonState } from "@states/index";

import UnstakePositionModalContainer from "../containers/unstake-position-modal-container/UnstakePositionModalContainer";

interface Props {
  positions: PoolPositionModel[];
  selectedIds: number[];
  isGetWGNOT: boolean;
}

export const useUnstakePositionModal = ({
  positions,
  selectedIds,
  isGetWGNOT,
}: Props) => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const selectedPositions = useMemo(() => {
    return positions.filter(position => selectedIds.includes(position.id));
  }, [positions, selectedIds]);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(
      <UnstakePositionModalContainer
        positions={selectedPositions}
        isGetWGNOT={isGetWGNOT}
      />,
    );
  }, [setModalContent, setOpenedModal, selectedPositions, isGetWGNOT]);

  return {
    openModal,
  };
};
