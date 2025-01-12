import React, { useCallback, useEffect, useMemo } from "react";
import Modal from "@components/common/modal/Modal";
import { useAtom } from "jotai";
import { CommonState, WalletState } from "@states/index";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { Z_INDEX } from "@styles/zIndex";
import useRouter from "@hooks/common/use-custom-router";
import ApproveTransactionModalContainer from "@containers/approve-transaction-modal-container/ApproveTransactionModalContainer";

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
  const [approveTransactionModalContent, setApproveTransactionModalContent] = useAtom(
    CommonState.approveTransactinoModalContent,
  );

  const visible = useMemo(() => {
    return openedModal && modalContent !== null;
  }, [openedModal, modalContent]);

  const visibleTransactionModal = useMemo(() => {
    return openedTransactionModal && transactionModalContent !== null;
  }, [openedTransactionModal, transactionModalContent]);

  const visibleApproveTransactionModal = useMemo(() => {
    return openedApproveTransactionModal && approveTransactionModalContent !== null;
  }, [openedApproveTransactionModal, approveTransactionModalContent]);

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
    setApproveTransactionModalContent(null);
  }, []);

  useEffect(() => {
    const handleApprove = () => {
      eventBus.emit("transaction-approved");
      closeApproveTransactionModal();
    };

    const handleReject = () => {
      eventBus.emit("transaction-rejected");
      closeTransactionModal();
      closeApproveTransactionModal();
    };

    eventBus.on("show-approve-modal", () => {
      setApproveTransactionModalContent(
        <ApproveTransactionModalContainer onApprove={handleApprove} onReject={handleReject} />,
      );
      setOpenedApproveTransactionModal(true);
    });

    return () => {
      eventBus.off("show-approve-modal", () => {});
    };
  }, []);

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
          {approveTransactionModalContent}
        </Modal>
      )}
    </React.Fragment>
  );
};

export default ModalContainer;
