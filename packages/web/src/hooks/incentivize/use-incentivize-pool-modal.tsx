import IncentivizePoolModalContainer from "@containers/incentivize-pool-modal-container/IncentivizePoolModalContainer";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export interface Props {
  openModal: () => void;
}

export const useIncentivizePoolModal = (): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(<IncentivizePoolModalContainer />);
  }, [setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
