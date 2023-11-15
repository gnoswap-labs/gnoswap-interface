import OneClickStakingModalContainer from "@containers/one-click-staking-modal-container/OneClickStakingModalContainer";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export interface Props {
  openModal: () => void;
}

export const useOneClickStakingModal = (): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(<OneClickStakingModalContainer />);
  }, [setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
