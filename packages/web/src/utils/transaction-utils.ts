import BigNumber from "bignumber.js";
import { eventBus } from "./event-bus";
import { WalletClient } from "@common/clients/wallet-client";

import {
  isContractMessage,
  SendTransactionRequestParam,
  TransactionMessage,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import { DEFAULT_CHAIN_ID, WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { DEFAULT_GAS_WANTED } from "@common/values";
import { Document } from "src/types/transaction-messages.types";

import { createDocument } from "./messages.utils";
import { Tx } from "@gnolang/tm2-js-client";
import { TransactionService } from "@services/transaction";

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
  try {
    if (!walletClient) {
      throw new Error("Wallet client is not initialized");
    }

    const document = await generateTransactionDataDocument(walletClient, transaction);

    if (walletClient.getWalletType() === "SOCIAL_WALLET") {
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

      return await executeTransaction(updatedTransaction);
    }

    // Handle locked wallet state for Adena v1.15.0+ auto-lock compatibility
    const SITE_NAME = "Gnoswap";
    await walletClient.addEstablishedSite(SITE_NAME);
    return await executeTransaction(transaction);
  } catch (error) {
    console.error("Transaction guard error:", error);
    return {
      code: 5000,
      data: null,
      message: error instanceof Error ? error.message : "Unknown transaction error occurred",
      status: "failure",
      type: "TRANSACTION_ERROR",
    };
  }
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

/**
 * Checks if the given token path corresponds to the wrapped GNOT token path
 *
 * @param path - The token path to check
 * @returns True if the path matches wrapped GNOT path, false otherwise
 */
export const isWrappedGnotPath = (path: string) => path === WRAPPED_GNOT_PATH;

/**
 * Determines the appropriate send amount when trading with wrapped GNOT

 * @param {string} tokenAWrappedPath - The wrapped path of token A
 * @param {string} tokenBWrappedPath - The wrapped path of token B
 * @param {string} tokenAAmountRaw - The raw amount of token A
 * @param {string} tokenBAmountRaw - The raw amount of token B
 * @returns {string|null} The raw token amount to send if one of the tokens is wrapped GNOT, null otherwise
 */
export const getSendAmount = (
  tokenAWrappedPath: string,
  tokenBWrappedPath: string,
  tokenAAmountRaw: string,
  tokenBAmountRaw: string,
) => {
  if (isWrappedGnotPath(tokenAWrappedPath)) return tokenAAmountRaw;
  if (isWrappedGnotPath(tokenBWrappedPath)) return tokenBAmountRaw;
  return null;
};

const DEFAULT_GAS_WANTED = 2_000_000_000;
const MINIMUM_GAS_PRICE = 0.001 as const;

export function makeGasInfoBy(
  gasUsed: number | null | undefined,
  gasPrice: number | null | undefined,
): { gasWanted: number; gasFee: number } {
  const gasFeeBN = BigNumber(gasUsed || 1000).multipliedBy(gasPrice || MINIMUM_GAS_PRICE);

  return {
    gasWanted: Number(DEFAULT_GAS_WANTED),
    gasFee: Number(gasFeeBN.toFixed(0, BigNumber.ROUND_UP)),
  };
}

export async function makeEstimateGasTransaction(
  document: Document | null | undefined,
  transactionService: TransactionService | null,
  gasUsed: number,
  gasPrice: number | null,
): Promise<Tx | null> {
  if (!document) return null;

  const { gasFee, gasWanted } = makeGasInfoBy(gasUsed, gasPrice);
  if (!transactionService || !gasFee || !gasWanted) return null;
}
