import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { useCallback } from "react";

export const useClearModal = () => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const clear = useCallback(() => {
    setOpenedModal(false);
    setModalContent(null);
  }, [setOpenedModal, setModalContent]);

  return clear;
};
