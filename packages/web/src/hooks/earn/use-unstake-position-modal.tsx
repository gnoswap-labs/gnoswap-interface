import UnstakePositionModalContainer from "@containers/unstake-position-modal-container/UnstakePositionModalContainer";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export interface Props {
  openModal: () => void;
}

export const useUnstakePositionModal = (): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(<UnstakePositionModalContainer />);
  }, [setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
