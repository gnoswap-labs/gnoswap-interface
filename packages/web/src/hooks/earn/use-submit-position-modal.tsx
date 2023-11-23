import SubmitPositionModalContainer from "@containers/submit-position-modal-container/SubmitPositionModalContainer";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export interface Props {
  openModal: () => void;
}

export const useSubmitPositionModal = (): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(<SubmitPositionModalContainer />);
  }, [setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
