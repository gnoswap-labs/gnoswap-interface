import TransactionConfirmModal from "@components/common/transaction-confirm-modal/TransactionConfirmModal";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useForceRefetchQuery } from "./useForceRefetchQuery";
import { QUERY_KEY } from "@query/positions";
import { useWallet } from "@hooks/wallet/use-wallet";

export interface TransactionConfirmModalResponse {
  openModal: () => void;
  closeModal: () => void;
}

export interface UseTransactionConfirmModalProps {
  confirmCallback?: () => void;
  closeCallback?: () => void;
}

export const useTransactionConfirmModal = (props: UseTransactionConfirmModalProps): TransactionConfirmModalResponse => {
  const [, setOpenedModal] = useAtom(CommonState.openedTransactionModal);
  const [, setModalContent] = useAtom(CommonState.transactionModalContent);
  const [transactionModalData, setTransactionModalData] = useAtom(CommonState.transactionModalData);
  const forceRefect = useForceRefetchQuery();
  const { account } = useWallet();

  const closeModal = useCallback(() => {
    setOpenedModal(false);
    setModalContent(null);
    setTransactionModalData(null);
    props?.closeCallback?.();
  }, [setModalContent, setOpenedModal, setTransactionModalData, transactionModalData]);

  const confirm = useCallback(() => {
    closeModal();
    props?.confirmCallback?.();
    forceRefect({ queryKey: [QUERY_KEY.positions, account?.address || ""] });
    if (transactionModalData?.callback) {
      transactionModalData?.callback();
    }
  }, [closeModal, transactionModalData, account]);

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
          confirm={confirm}
          close={confirm}
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