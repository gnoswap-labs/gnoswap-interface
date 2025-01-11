import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";

import ApproveTransactionModalContainer from "@containers/approve-transaction-modal-container/ApproveTransactionModalContainer";
import { WalletClient } from "@common/clients/wallet-client";

export const useApproveTransactionModal = () => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = React.useCallback(
    (onApprove: () => void) => {
      setOpenedModal(true);
      setModalContent(<ApproveTransactionModalContainer onApprove={onApprove} />);
    },
    [setModalContent, setOpenedModal],
  );

  return {
    openModal,
  };
};

export const withSocialWalletApproval = async <T,>(
  walletClient: WalletClient,
  executeTransaction: () => Promise<T>,
): Promise<T> => {
  console.log(walletClient, walletClient.getWalletType(), "walletClient?");
  if (walletClient.getWalletType() === "SOCIAL_WALLET") {
    return new Promise((resolve, reject) => {
      const { openModal } = useApproveTransactionModal();
      console.log("openModal!");
      openModal(async () => {
        try {
          const result = await executeTransaction();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  return executeTransaction();
};
