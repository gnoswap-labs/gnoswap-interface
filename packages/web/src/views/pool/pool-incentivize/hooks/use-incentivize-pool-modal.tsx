import { useAtom } from "jotai";
import { useCallback } from "react";

import { CommonState } from "@states/index";

import IncentivizePoolModalContainer from "../containers/incentivize-pool-modal-container/IncentivizePoolModalContainer";

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
