import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";

import ApproveTransactionModalContainer from "@containers/approve-transaction-modal-container/ApproveTransactionModalContainer";

export const useApproveTransactionModal = () => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = React.useCallback(
    (onApprove: () => void) => {
      setOpenedModal(true);
      setModalContent(<ApproveTransactionModalContainer onApprove={onApprove} />);
    },
    [setModalContent, setOpenedModal],
  );

  return {
    openModal,
  };
};
