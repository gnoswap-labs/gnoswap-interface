import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

import TransactionConfirmModal from "@components/common/transaction-confirm-modal/TransactionConfirmModal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { QUERY_KEY } from "@query/query-keys";
import { CommonState } from "@states/index";

import { useForceRefetchQuery } from "./useForceRefetchQuery";

export interface TransactionConfirmModalResponse {
  openModal: () => void;
  closeModal: () => void;
  update: (
    status: CommonState.TransactionConfirmStatus,
    description: string | null,
    txHash: string | null,
    callback?: (() => void) | undefined,
  ) => void;
}

export interface UseTransactionConfirmModalProps {
  confirmCallback?: () => void;
  closeCallback?: () => void;
}

export const useTransactionConfirmModal = (
  props?: UseTransactionConfirmModalProps,
): TransactionConfirmModalResponse => {
  const [, setOpenedModal] = useAtom(CommonState.openedTransactionModal);
  const [, setModalContent] = useAtom(CommonState.transactionModalContent);
  const [transactionModalData, setTransactionModalData] = useAtom(
    CommonState.transactionModalData,
  );
  const forceRefect = useForceRefetchQuery();
  const { account } = useWallet();

  const closeModal = useCallback(
    (isClear = false) => {
      setOpenedModal(false);
      setModalContent(null);
      setTransactionModalData(null);
      if (!isClear) props?.closeCallback?.();
    },
    [
      setModalContent,
      setOpenedModal,
      setTransactionModalData,
      transactionModalData,
      props,
    ],
  );

  const confirm = useCallback(() => {
    closeModal();
    props?.confirmCallback?.();
    forceRefect({ queryKey: [QUERY_KEY.positions, account?.address || ""] });
    if (transactionModalData?.callback) {
      transactionModalData?.callback();
    }
  }, [closeModal, transactionModalData, account, props]);

  const update = useCallback(
    (
      status: CommonState.TransactionConfirmStatus,
      description: string | null,
      txHash: string | null,
      callback?: (() => void) | undefined,
    ) => {
      setTransactionModalData({
        status,
        description,
        txHash,
        callback,
      });
    },
    [],
  );

  const openModal = useCallback(() => {
    setOpenedModal(true);
  }, [setOpenedModal]);

  useEffect(() => {
    if (transactionModalData) {
      setModalContent(
        <TransactionConfirmModal
          status={transactionModalData.status}
          description={transactionModalData.description}
          txHash={transactionModalData.txHash}
          confirm={confirm}
          close={confirm}
        />,
      );
    }
    return () => {
      setModalContent(null);
    };
  }, [closeModal, confirm, setModalContent, transactionModalData]);

  useEffect(() => {
    return () => {
      closeModal(true);
    };
  }, []);

  return {
    openModal,
    closeModal,
    update,
  };
};
