import React, { useCallback, useEffect, useMemo } from "react";
import { useAtom } from "jotai";

import useRouter from "@hooks/common/use-custom-router";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { CommonState, WalletState } from "@states/index";
import { Document } from "src/types/transaction-messages.types";
import { TX_EVENTS, type TransactionApprovalModalHandlers } from "@utils/transaction-utils";

import { Z_INDEX } from "@styles/zIndex";
import Modal from "@components/common/modal/Modal";
import TransactionApprovalModalContainer from "@containers/transaction-approval-modal-container/TransactionApprovalModalContainer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventCallback = (...args: any[]) => void;

class EventBus {
  private events: { [key: string]: EventCallback[] } = {};

  on(eventName: string, callback: EventCallback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName: string, callback: EventCallback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(eventName: string, data?: any) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach(callback => callback(data));
  }
}

export const eventBus = new EventBus();

const ModalContainer: React.FC = () => {
  const router = useRouter();
  const [openedModal, setOpendModal] = useAtom(CommonState.openedModal);
  const [modalContent, setModalContent] = useAtom(CommonState.modalContent);
  const [openedTransactionModal, setOpendTransactionModal] = useAtom(CommonState.openedTransactionModal);
  const [transactionModalContent, setTransactionModalContent] = useAtom(CommonState.transactionModalContent);
  const [, setWalletAccount] = useAtom(WalletState.loadingConnect);
  const [openedApproveTransactionModal, setOpenedApproveTransactionModal] = useAtom(
    CommonState.openedApproveTransactionModal,
  );
  const [transactionApprovalModalContent, setTransactionApprovalModalContent] = useAtom(
    CommonState.transactionApprovalModalContent,
  );

  const visible = useMemo(() => {
    return openedModal && modalContent !== null;
  }, [openedModal, modalContent]);

  const visibleTransactionModal = useMemo(() => {
    return openedTransactionModal && transactionModalContent !== null;
  }, [openedTransactionModal, transactionModalContent]);

  const visibleApproveTransactionModal = useMemo(() => {
    return openedApproveTransactionModal && transactionApprovalModalContent !== null;
  }, [openedApproveTransactionModal, transactionApprovalModalContent]);

  usePreventScroll(visible);
  usePreventScroll(visibleTransactionModal);
  usePreventScroll(visibleApproveTransactionModal);

  const closeModal = useCallback(() => {
    setOpendModal(false);
    setModalContent(null);
    setTransactionModalContent(null);
    setWalletAccount("initial");
  }, []);

  const closeTransactionModal = useCallback(() => {
    closeModal();
    setOpendTransactionModal(false);
    setTransactionModalContent(null);
  }, []);

  const closeApproveTransactionModal = useCallback(() => {
    setOpenedApproveTransactionModal(false);
    setTransactionApprovalModalContent(null);
  }, []);

  useEffect(() => {
    const handlers: TransactionApprovalModalHandlers = {
      handleApprove: (document: Document) => {
        eventBus.emit(TX_EVENTS.APPROVED, document);
        closeApproveTransactionModal();
      },
      handleReject: () => {
        eventBus.emit(TX_EVENTS.REJECTED);
        closeTransactionModal();
        closeApproveTransactionModal();
      },
      cleanup: () => {
        eventBus.off(TX_EVENTS.SHOW_MODAL, () => {});
      },
    };

    const handleShowModal = (document: Document) => {
      setTransactionApprovalModalContent(
        <TransactionApprovalModalContainer
          document={document}
          onApprove={handlers.handleApprove}
          onReject={handlers.handleReject}
        />,
      );
      setOpenedApproveTransactionModal(true);
    };

    eventBus.on(TX_EVENTS.SHOW_MODAL, handleShowModal);
    return handlers.cleanup;
  }, [closeApproveTransactionModal, closeTransactionModal]);

  useEscCloseModal(closeTransactionModal);

  useEffect(() => {
    closeTransactionModal();
  }, [router.pathname]);

  return (
    <React.Fragment>
      {visible && (
        <Modal
          style={{
            hidden: visibleTransactionModal,
          }}
          exitClick={closeModal}
        >
          {modalContent}
        </Modal>
      )}
      {visibleTransactionModal && (
        <Modal
          style={{
            zIndex: Z_INDEX.secondModal,
          }}
        >
          {transactionModalContent}
        </Modal>
      )}
      {visibleApproveTransactionModal && (
        <Modal
          style={{
            zIndex: Z_INDEX.thirdModal,
          }}
        >
          {transactionApprovalModalContent}
        </Modal>
      )}
    </React.Fragment>
  );
};

export default ModalContainer;
