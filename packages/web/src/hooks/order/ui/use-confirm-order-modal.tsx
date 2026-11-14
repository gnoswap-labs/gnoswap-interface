import { useAtom, useStore } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

import { CommonState } from "@states/index";

/**
 * Shows an order confirm modal in the shared modal slot and keeps its content
 * current while it is open, so values that refresh after opening (schedule,
 * gas estimate) reach the modal.
 */
export const useConfirmOrderModal = (renderContent: () => JSX.Element) => {
  const store = useStore();
  const [openedModal, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const [opened, setOpened] = useState(false);
  // The content this hook last put in the shared slot, to tell it from another flow's modal.
  const ownContent = useRef<JSX.Element | null>(null);

  const showContent = useCallback(
    (content: JSX.Element | null) => {
      ownContent.current = content;
      setModalContent(content);
    },
    [setModalContent],
  );

  const openModal = useCallback(() => {
    setOpened(true);
    setOpenedModal(true);
    showContent(renderContent());
  }, [renderContent, setOpenedModal, showContent]);

  const closeModal = useCallback(() => {
    setOpened(false);
    setOpenedModal(false);
    showContent(null);
  }, [setOpenedModal, showContent]);

  // The shared modal can also be closed from outside (overlay, Esc).
  useEffect(() => {
    if (!openedModal) setOpened(false);
  }, [openedModal]);

  useEffect(() => {
    if (!opened) return;
    // Another flow took the shared slot; stop refreshing it with this confirmation.
    if (ownContent.current !== null && store.get(CommonState.modalContent) !== ownContent.current) {
      ownContent.current = null;
      setOpened(false);
      return;
    }
    showContent(renderContent());
  }, [opened, renderContent, showContent, store]);

  // The modal is rendered outside the owner, so close it with the owner (e.g. an account
  // change remounts the order list): its confirm would act on a selection that is gone.
  // A modal another flow opened since then is left alone.
  useEffect(
    () => () => {
      const content = ownContent.current;
      if (content === null || store.get(CommonState.modalContent) !== content) return;
      store.set(CommonState.openedModal, false);
      store.set(CommonState.modalContent, null);
    },
    [store],
  );

  return { opened, openModal, closeModal };
};
