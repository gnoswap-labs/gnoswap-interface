import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { PoolPositionModel } from "@models/position/pool-position-model";
import { CommonState } from "@states/index";

import StakePositionModalContainer from "../containers/stake-position-modal-container/StakePositionModalContainer";

export interface Props {
  positions: PoolPositionModel[];
  selectedIds: number[];
  refetchPositions: () => Promise<void>;
}

export const useStakePositionModal = ({
  positions,
  selectedIds,
  refetchPositions,
}: Props) => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const selectedPositions = useMemo(() => {
    return positions.filter(position => selectedIds.includes(position.id));
  }, [positions, selectedIds]);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(
      <StakePositionModalContainer
        positions={selectedPositions}
        refetchPositions={refetchPositions}
      />,
    );
  }, [refetchPositions, selectedPositions, setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
