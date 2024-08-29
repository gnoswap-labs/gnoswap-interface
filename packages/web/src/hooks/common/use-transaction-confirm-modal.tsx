import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

import TransactionConfirmModal from "@components/common/transaction-confirm-modal/TransactionConfirmModal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { CommonState } from "@states/index";

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
  const { account } = useWallet();

  const closeModal = useCallback(
    (isClear = false) => {
      setOpenedModal(false);
      setModalContent(null);
      setTransactionModalData(null);
      if (!isClear) props?.closeCallback?.();
    },
    [props],
  );

  const confirm = useCallback(() => {
    closeModal();
    props?.confirmCallback?.();
    if (transactionModalData?.callback) {
      transactionModalData?.callback();
    }
  }, [transactionModalData, account, props]);

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
  }, [transactionModalData]);

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
