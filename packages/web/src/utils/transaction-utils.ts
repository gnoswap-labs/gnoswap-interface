import { eventBus } from "@containers/modal-container/ModalContainer";
import { WalletClient } from "@common/clients/wallet-client";
import { TransactionMessage } from "@common/clients/wallet-client/protocols";

const TX_EVENTS = {
  SHOW_MODAL: "show-approve-modal",
  APPROVED: "transaction-approved",
  REJECTED: "transaction-rejected",
};

// type TransactionEvent = (typeof TX_EVENTS)[keyof typeof TX_EVENTS];

/**
 *
 * When linked to a social wallet
 * Brings up the transaction authorization modal and returns whether the user has authorized or not.
 *
 * Utility function to handle social wallet transaction approvals
 *
 * This function shows an approval modal for social wallet transactions
 * and returns a promise that resolves with the user's decision
 *
 * @returns Whether the user is approved - Promise<boolean>
 *
 */
export const showApproveTransactionModal = async (messages: TransactionMessage[]): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const eventHandlers = {
        handleApprove: () => {
          cleanup();
          resolve(true);
        },
        handleReject: () => {
          cleanup();
          resolve(false);
        },
      };

      const cleanup = () => {
        eventBus.off(TX_EVENTS.APPROVED, eventHandlers.handleApprove);
        eventBus.off(TX_EVENTS.REJECTED, eventHandlers.handleReject);
      };

      eventBus.on(TX_EVENTS.APPROVED, eventHandlers.handleApprove);
      eventBus.on(TX_EVENTS.REJECTED, eventHandlers.handleReject);

      eventBus.emit(TX_EVENTS.SHOW_MODAL, messages);

      const TIMEOUT_MS = 1 * 60 * 1000;
      setTimeout(() => {
        cleanup();
        reject(new Error("Transaction approval timeout"));
      }, TIMEOUT_MS);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * Higher-order function that wraps a transaction execution with social-wallet approval flow
 *
 * If the wallet is a social-wallet, it will show an approval modal before executing the transaction
 * If not, it will execute the transaction directly
 *
 * @param The WalletClient instance - walletClient
 * @param The transaction function to execution - executeTransaction
 * @returns Promise<T> - The result of the transaction execution
 *
 */
export const withSocialWalletApproval = async <T>(
  walletClient: WalletClient | null,
  messages: TransactionMessage[],
  executeTransaction: () => Promise<T>,
): Promise<T> => {
  if (!walletClient) {
    throw new Error("Wallet client is not initialized");
  }

  if (walletClient.getWalletType() === "SOCIAL_WALLET") {
    const isApproved = await showApproveTransactionModal(messages);
    if (!isApproved) {
      throw new Error("Transaction rejected");
    }
  }

  return executeTransaction();
};
