import TransactionConfirmModal from "@components/common/transaction-confirm-modal/TransactionConfirmModal";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

export interface TransactionConfirmModalResponse {
  openModal: () => void;
  closeModal: () => void;
}

export const useTransactionConfirmModal = (): TransactionConfirmModalResponse => {
  const [, setOpenedModal] = useAtom(CommonState.openedTransactionModal);
  const [, setModalContent] = useAtom(CommonState.transactionModalContent);
  const [transactionModalData, setTransactionModalData] = useAtom(CommonState.transactionModalData);

  const closeModal = useCallback(() => {
    setOpenedModal(false);
    setModalContent(null);
    setTransactionModalData(null);
  }, [setModalContent, setOpenedModal, setTransactionModalData]);

  const openModal = useCallback(() => {
    setOpenedModal(true);
  }, [setOpenedModal]);

  useEffect(() => {
    if (transactionModalData) {
      setModalContent(
        <TransactionConfirmModal
          status={transactionModalData.status}
          description={transactionModalData.description}
          scannerURL={transactionModalData.scannerURL}
          close={closeModal}
        />
      );
    }
    return () => { setModalContent(null); };
  }, [closeModal, setModalContent, transactionModalData]);

  useEffect(() => {
    return () => { closeModal(); };
  }, []);

  return {
    openModal,
    closeModal,
  };
};