import { useAtom } from "jotai";
import { useCallback } from "react";

import { CommonState } from "@states/index";

import IncentivizePoolModalContainer from "../containers/incentivize-pool-modal-container/IncentivizePoolModalContainer";

export interface Props {
  poolPath?: string;
}

export const useIncentivizePoolModal = ({ poolPath }: Props = {}) => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(<IncentivizePoolModalContainer poolPath={poolPath} />);
  }, [setModalContent, setOpenedModal, poolPath]);

  return {
    openModal,
  };
};
