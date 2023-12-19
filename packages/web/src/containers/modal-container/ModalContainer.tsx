import React, { useCallback, useMemo } from "react";
import Modal from "@components/common/modal/Modal";
import { useAtom } from "jotai";
import { CommonState, WalletState } from "@states/index";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { Z_INDEX } from "@styles/zIndex";

const ModalContainer: React.FC = () => {
  const [openedModal, setOpendModal] = useAtom(CommonState.openedModal);
  const [modalContent, setModalContent] = useAtom(CommonState.modalContent);
  const [openedTransactionModal, setOpendTransactionModal] = useAtom(CommonState.openedTransactionModal);
  const [transactionModalContent, setTransactionModalContent] = useAtom(CommonState.transactionModalContent);
  const [, setWalletAccount] = useAtom(WalletState.loadingConnect);

  const visible = useMemo(() => {
    return openedModal && modalContent !== null;
  }, [openedModal, modalContent]);

  const visibleTransactionModal = useMemo(() => {
    return openedTransactionModal && transactionModalContent !== null;
  }, [openedTransactionModal, transactionModalContent]);

  usePreventScroll(visible);
  usePreventScroll(visibleTransactionModal);

  const closeModal = useCallback(() => {
    setOpendModal(false);
    setModalContent(null);
    setWalletAccount("initial");
  }, []);

  const closeTransactionModal = useCallback(() => {
    closeModal();
    setOpendTransactionModal(false);
    setTransactionModalContent(null);
  }, []);

  useEscCloseModal(closeTransactionModal);

  return (
    <React.Fragment>
      {visible && (
        <Modal
          style={{
            hidden: visibleTransactionModal
          }}
          exitClick={closeModal}
        >
          {modalContent}
        </Modal>
      )}
      {visibleTransactionModal && (
        <Modal
          style={{
            width: 460,
            height: 317,
            zIndex: Z_INDEX.secondModal
          }}
          exitClick={closeTransactionModal}
        >
          {transactionModalContent}
        </Modal>
      )}
    </React.Fragment>
  );
};

export default ModalContainer;