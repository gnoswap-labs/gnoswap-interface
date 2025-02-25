import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";
import { useClearModal } from "@hooks/common/use-clear-modal";
import ConnectedSocialWalletModal from "@components/common/connected-social-wallet-modal/ConnectedSocialWalletModal";
import { SOCIAL_WALLET_MODAL_HIDE_EXPIRES_AT, SOCIAL_WALLET_MODAL_SHOWN_IN_SESSION } from "@states/common";

const MODAL_EXPIRY_DAYS = 30;

interface ModalControls {
  openModal: () => void;
  closeModal: () => void;
}

const StorageUtils = {
  /** Get the modal visibility flag from session storage */
  getSessionFlag: () => sessionStorage.getItem(SOCIAL_WALLET_MODAL_SHOWN_IN_SESSION),
  /** Set the modal visibility flag for session storage */
  setSessionFlag: () => sessionStorage.setItem(SOCIAL_WALLET_MODAL_SHOWN_IN_SESSION, "true"),
  /** Get expiration dates from local storage */
  getExpiryDate: () => localStorage.getItem(SOCIAL_WALLET_MODAL_HIDE_EXPIRES_AT),
  /**
   * Set an expiration date for local storage
   * @param {number} date - Expiration date timestamp
   *
   */
  setExpiryDate: (date: number) => localStorage.setItem(SOCIAL_WALLET_MODAL_HIDE_EXPIRES_AT, date.toString()),
};

export const useConnectedSocialWalletModal = (): ModalControls => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const clearModal = useClearModal();

  const closeModal = React.useCallback(() => {
    clearModal();
  }, [clearModal]);

  const handleDontShowAgain = React.useCallback(() => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + MODAL_EXPIRY_DAYS);

    StorageUtils.setExpiryDate(expiryDate.getTime());
  }, []);

  const shouldShowModal = React.useCallback(() => {
    if (StorageUtils.getSessionFlag()) return false;

    const expireDate = StorageUtils.getExpiryDate();
    if (!expireDate) return true;

    const currentTime = new Date().getTime();
    return currentTime > parseInt(expireDate);
  }, []);

  const openModal = React.useCallback(() => {
    if (!shouldShowModal()) return;

    StorageUtils.setSessionFlag();

    setOpenedModal(true);
    setModalContent(<ConnectedSocialWalletModal close={closeModal} onDontShowAgain={handleDontShowAgain} />);
  }, [setOpenedModal, setModalContent, shouldShowModal, handleDontShowAgain]);

  return { openModal, closeModal };
};
