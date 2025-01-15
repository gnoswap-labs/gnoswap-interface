import { eventBus } from "@containers/modal-container/ModalContainer";
import { WalletClient } from "@common/clients/wallet-client";

import {
  isContractMessage,
  SendTransactionRequestParam,
  TransactionMessage,
} from "@common/clients/wallet-client/protocols";
import { DEFAULT_CHAIN_ID } from "@constants/environment.constant";
import { DEFAULT_GAS_WANTED } from "@common/values";
import { Document } from "src/types/transaction-messages.types";

import { createDocument } from "./messages.utils";

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
export const showApproveTransactionModal = async (document: Document): Promise<boolean> => {
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

      eventBus.emit(TX_EVENTS.SHOW_MODAL, document);

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
 * @param @deprecated The transaction messages to execute - messages
 * @param The transaction function to execution - executeTransaction
 * @param The transaction request parameters - transaction
 * @returns Promise<T> - The result of the transaction execution
 *
 */
export const withSocialWalletApproval = async <T>(
  walletClient: WalletClient | null,
  messages: TransactionMessage[], // @deprecated
  executeTransaction: () => Promise<T>,
  transaction?: SendTransactionRequestParam,
): Promise<T> => {
  if (!walletClient) {
    throw new Error("Wallet client is not initialized");
  }

  if (walletClient.getWalletType() === "SOCIAL_WALLET") {
    const messagess =
      transaction?.messages.map(msg => {
        if (isContractMessage(msg)) {
          return {
            type: "/vm.m_call",
            value: msg,
          };
        }
        return {
          type: "/bank.MsgSend",
          value: msg,
        };
      }) || [];
    const account = await walletClient.getAccount();
    const { accountNumber = 0, sequence = 0 } = account.data || {};

    const document = createDocument({
      accountNumber: Number(accountNumber),
      accountSequence: Number(sequence),
      chainId: DEFAULT_CHAIN_ID || "",
      messages: messagess,
      gasWanted: transaction?.gasWanted || DEFAULT_GAS_WANTED,
      gasFee: transaction?.gasFee || 1_000_000,
      memo: transaction?.memo || "",
    });

    const isApproved = await showApproveTransactionModal(document);
    if (!isApproved) {
      throw new Error("Transaction rejected");
    }
  }

  return executeTransaction();
};
