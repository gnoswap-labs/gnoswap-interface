import { eventBus } from "./event-bus";
import { WalletClient } from "@common/clients/wallet-client";

import {
  isContractMessage,
  SendTransactionRequestParam,
  TransactionMessage,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import { DEFAULT_CHAIN_ID } from "@constants/environment.constant";
import { DEFAULT_GAS_WANTED } from "@common/values";
import { Document } from "src/types/transaction-messages.types";

import { createDocument } from "./messages.utils";

export const TX_EVENTS = {
  SHOW_MODAL: "show-approve-modal",
  APPROVED: "transaction-approved",
  REJECTED: "transaction-rejected",
} as const;

export type TransactionEvent = (typeof TX_EVENTS)[keyof typeof TX_EVENTS];

export interface TransactionApprovalModalHandlers {
  handleApprove: (document: Document) => void;
  handleReject: () => void;
  cleanup: () => void;
}

const TIMEOUT_MS = 1 * 60 * 1000; // 1 minute
const DEFAULT_GAS_FEE = 1_000_000;

type MessageType = {
  type: "/vm.m_call" | "/bank.MsgSend";
  value: unknown;
};

/**
 * Creates event handlers for the Transaction Approval Modal
 */
const createTransactionApprovalModalHandlers = (
  resolve: (value: Document | false) => void,
): TransactionApprovalModalHandlers => {
  const cleanup = () => {
    eventBus.off(TX_EVENTS.APPROVED as TransactionEvent, handleApprove);
    eventBus.off(TX_EVENTS.REJECTED as TransactionEvent, handleReject);
  };

  const handleApprove = (updateDocument: Document) => {
    cleanup();
    resolve(updateDocument);
  };

  const handleReject = () => {
    cleanup();
    resolve(false);
  };

  return { handleApprove, handleReject, cleanup };
};

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
export const showTransactionApprovalModal = async (document: Document): Promise<Document | false> => {
  return new Promise((resolve, reject) => {
    try {
      const { handleApprove, handleReject, cleanup } = createTransactionApprovalModalHandlers(resolve);

      eventBus.on(TX_EVENTS.APPROVED as TransactionEvent, handleApprove);
      eventBus.on(TX_EVENTS.REJECTED as TransactionEvent, handleReject);
      eventBus.emit(TX_EVENTS.SHOW_MODAL as TransactionEvent, document);

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
 * Transforms transaction messages to the required format
 */
const transformMessages = (messages: TransactionMessage[]): MessageType[] => {
  return messages.map(message => ({
    type: isContractMessage(message) ? "/vm.m_call" : "/bank.MsgSend",
    value: message,
  }));
};

/**
 *
 * Generate documents based on transaction data
 *
 * @param The WalletClient instance - walletClient
 * @param The transaction request parameters - transaction
 * @returns Generated transaction document
 *
 */
const generateTransactionDataDocument = async (
  walletClient: WalletClient,
  transaction?: SendTransactionRequestParam,
): Promise<Document> => {
  const account = await walletClient.getAccount();
  const { accountNumber = 0, sequence = 0 } = account.data || {};

  return createDocument({
    accountNumber: Number(accountNumber),
    accountSequence: Number(sequence),
    chainId: DEFAULT_CHAIN_ID || "",
    messages: transaction?.messages ? transformMessages(transaction.messages) : [],
    gasWanted: transaction?.gasWanted || DEFAULT_GAS_WANTED,
    gasFee: transaction?.gasFee || DEFAULT_GAS_FEE,
    memo: transaction?.memo || "",
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
 * @param The transaction request parameters - transaction
 * @param The transaction function to execution - executeTransaction
 * @returns Promise<T> - The result of the transaction execution
 *
 */
export const withTransactionGuard = async <T>(
  walletClient: WalletClient | null,
  transaction: SendTransactionRequestParam,
  executeTransaction: (updatedTransaction?: SendTransactionRequestParam) => Promise<WalletResponse<T>>,
): Promise<WalletResponse<T>> => {
  if (!walletClient) {
    throw new Error("Wallet client is not initialized");
  }

  if (walletClient.getWalletType() === "SOCIAL_WALLET") {
    const document = await generateTransactionDataDocument(walletClient, transaction);
    const approved = await showTransactionApprovalModal(document);

    if (approved === false) {
      return {
        code: 4000,
        data: null,
        message: "The transaction has been rejected by the user.",
        status: "failure",
        type: "TRANSACTION_REJECTED",
      };
    }

    const updatedTransaction = {
      ...transaction,
      memo: approved.memo,
    };

    return executeTransaction(updatedTransaction);
  }

  // Handle locked wallet state for Adena v1.15.0+ auto-lock compatibility
  const SITE_NAME = "Gnoswap";
  await walletClient.addEstablishedSite(SITE_NAME);
  return executeTransaction(transaction);
};

/**
 *
 * generate the parameters needed to send transacions
 *
 * @param {Object} params - SendTransaction parameters
 * @param messages - Array of messages to be included in the transaction
 * @param gasFee - Transaction gas fee
 * @param gasWanted? - Transaction gas wanted
 * @param memo? - Transaction memo
 * @returns An object of parameters required to execute the transaction.
 *
 */
export const generateSendTransactionParams = (params: SendTransactionRequestParam): SendTransactionRequestParam => {
  const { messages, gasFee, gasWanted = DEFAULT_GAS_WANTED, memo = "" } = params;

  return {
    messages,
    gasFee,
    ...(gasWanted && { gasWanted }),
    ...(memo && { memo }),
  };
};
