import React, { useCallback, useMemo } from "react";
import Modal from "@components/common/modal/Modal";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";

const ModalContainer: React.FC = () => {
  const [openedModal, setOpendModal] = useAtom(CommonState.openedModal);
  const [modalContent] = useAtom(CommonState.modalContent);

  const visible = useMemo(() => {
    return openedModal && modalContent !== null;
  }, [openedModal, modalContent]);

  usePreventScroll(visible);

  const closeModal = useCallback(() => {
    setOpendModal(false);
  }, [setOpendModal]);

  return visible ? (
    <Modal
      exitClick={closeModal}
    >
      {modalContent}
    </Modal>
  ) : (
    <div />
  );
};

export default ModalContainer;