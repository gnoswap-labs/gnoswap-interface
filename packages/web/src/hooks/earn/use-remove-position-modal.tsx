import RemovePositionModalContainer from "@containers/remove-position-modal-container/RemovePositionModalContainer";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export interface Props {
  openModal: () => void;
}

export const useRemovePositionModal = (): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(<RemovePositionModalContainer />);
  }, [setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
