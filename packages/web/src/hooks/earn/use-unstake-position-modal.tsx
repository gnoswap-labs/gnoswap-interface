import UnstakePositionModalContainer from "@containers/unstake-position-modal-container/UnstakePositionModalContainer";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

interface Props {
  positions: PoolPositionModel[];
  selectedIds: string[];
}

export const useUnstakePositionModal = ({
  positions,
  selectedIds,
}: Props) => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const selectedPositions = useMemo(() => {
    return positions.filter(position => selectedIds.includes(position.id));
  }, [positions, selectedIds]);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(<UnstakePositionModalContainer positions={selectedPositions} />);
  }, [setModalContent, setOpenedModal, selectedPositions]);

  return {
    openModal,
  };
};
