import SubmitPositionModalContainer from "@containers/submit-position-modal-container/SubmitPositionModalContainer";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

export interface Props {
  positions: PoolPositionModel[];
  selectedIds: string[];
}

export const useSubmitPositionModal = ({
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
    setModalContent(
      <SubmitPositionModalContainer positions={selectedPositions} />
    );
  }, [selectedPositions, setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
