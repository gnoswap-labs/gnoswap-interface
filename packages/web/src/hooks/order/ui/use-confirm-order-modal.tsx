import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

import { CommonState } from "@states/index";

/**
 * Shows an order confirm modal in the shared modal slot and keeps its content
 * current while it is open, so values that refresh after opening (schedule,
 * gas estimate) reach the modal.
 */
export const useConfirmOrderModal = (renderContent: () => JSX.Element) => {
  const [openedModal, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const [opened, setOpened] = useState(false);

  const openModal = useCallback(() => {
    setOpened(true);
    setOpenedModal(true);
    setModalContent(renderContent());
  }, [renderContent, setModalContent, setOpenedModal]);

  const closeModal = useCallback(() => {
    setOpened(false);
    setOpenedModal(false);
    setModalContent(null);
  }, [setModalContent, setOpenedModal]);

  // The shared modal can also be closed from outside (overlay, Esc).
  useEffect(() => {
    if (!openedModal) setOpened(false);
  }, [openedModal]);

  useEffect(() => {
    if (!opened) return;
    setModalContent(renderContent());
  }, [opened, renderContent, setModalContent]);

  return { opened, openModal, closeModal };
};
