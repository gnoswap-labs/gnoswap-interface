import { WalletClient } from "@common/clients/wallet-client";
import BigNumber from "bignumber.js";
import { eventBus } from "./event-bus";

import {
  isContractMessage,
  SendTransactionRequestParam,
  TransactionMessage,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import { DEFAULT_GAS_WANTED } from "@common/values";
import { DEFAULT_CHAIN_ID, WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { ContractMessage, Document } from "src/types/transaction-messages.types";

import { GasToken } from "@common/values/token-constant";
import { Any, MsgAddPackage, MsgCall, MsgEndpoint, MsgRun, MsgSend } from "@gnolang/gno-js-client";
import { Tx, TxFee } from "@gnolang/tm2-js-client";
import { TransactionService } from "@services/transaction";
import { createDocument } from "./messages.utils";
import { isNativeTokenPath, makeRawTokenAmount } from "./token-utils";

export const TX_EVENTS = {
  SHOW_MODAL: "show-approve-modal",
  APPROVED: "transaction-approved",
  REJECTED: "transaction-rejected",
} as const;

export type TransactionEvent = typeof TX_EVENTS[keyof typeof TX_EVENTS];

export interface TransactionApprovalModalHandlers {
  handleApprove: (document: Document) => void;
  handleReject: () => void;
  cleanup: () => void;
}

const TIMEOUT_MS = 1 * 60 * 1000; // 1 minute
const DEFAULT_GAS_FEE = 1_000_000;

export interface RawMemPackage {
  name: string;
  path: string;
  files: {
    name: string;
    body: string;
  }[];
}

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
const transformMessages = (messages: TransactionMessage[]): ContractMessage[] => {
  return messages.map(message => {
    if (isContractMessage(message)) {
      return {
        type: "/vm.m_call" as const,
        value: {
          caller: message.caller,
          send: message.send,
          pkg_path: message.pkg_path,
          func: message.func,
          args: message.args,
        } as MsgCall,
      };
    } else {
      return {
        type: "/bank.MsgSend" as const,
        value: {
          from_address: message.from_address,
          to_address: message.to_address,
          amount: message.amount,
        } as MsgSend,
      };
    }
  });
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

    if (walletClient.getWalletType() === "SOCIAL_WALLET") {
      const document = await generateTransactionDataDocument(walletClient, transaction);
      const approvedDocument = await showTransactionApprovalModal(document);

      if (!approvedDocument) {
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
        memo: approvedDocument.memo,
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

  const gasFeeRaw = Number(makeRawTokenAmount(GasToken, gasFee));

  return {
    messages,
    gasFee: gasFeeRaw,
    ...(gasWanted && { gasWanted: gasWanted }),
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

export const getWrappedGNOTDepositAmount = (
  tokenAPath: string,
  tokenBPath: string,
  tokenAAmount: string,
  tokenBAmount: string,
): string => {
  if (isNativeTokenPath(tokenAPath)) return tokenAAmount;
  if (isNativeTokenPath(tokenBPath)) return tokenBAmount;
  return "0";
};

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

  const modifedDocument = modifyDocument(document, gasWanted, gasFee);

  const { signed } = await transactionService.createTransaction(modifedDocument).catch(() => {
    return { signed: null };
  });
  if (!signed) {
    return documentToDefaultTx(modifedDocument);
  }

  return signed;
}

function modifyDocument(document: Document, gasWanted: number, gasFee: number): Document {
  return {
    ...document,
    fee: {
      ...document.fee,
      gas: gasWanted.toString(),
      amount: [
        {
          denom: GasToken.denom,
          amount: gasFee.toString(),
        },
      ],
    },
  };
}

export function documentToTx(document: Document): Tx {
  const messages: Any[] = document.msgs.map(encodeMessageValue);
  return {
    messages,
    fee: TxFee.create({
      gas_wanted: document.fee.gas || "0",
      gas_fee: document.fee.amount.map(feeAmount => `${feeAmount.amount}${feeAmount.denom}`).join(","),
    }),
    signatures: [],
    memo: document.memo,
  };
}

export function documentToDefaultTx(document: Document): Tx {
  const messages: Any[] = document.msgs.map(encodeMessageValue);
  return {
    messages,
    fee: TxFee.create({
      gas_wanted: document.fee.gas,
      gas_fee: document.fee.amount.map(feeAmount => `${feeAmount.amount}${feeAmount.denom}`).join(","),
    }),
    signatures: [
      {
        pub_key: {
          type_url: "",
          value: new Uint8Array(),
        },
        signature: new Uint8Array(),
      },
    ],
    memo: document.memo,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function encodeMessageValue(message: { type: string; value: any }) {
  switch (message.type) {
    case MsgEndpoint.MSG_ADD_PKG: {
      const value = message.value as MsgAddPackage;
      const packageData = value.package
        ? {
            name: value.package.name,
            path: value.package.path,
            files: value.package.files.map(file => ({
              name: file.name,
              body: file.body,
            })),
          }
        : undefined;

      const msgAddPackage = MsgAddPackage.create({
        creator: value.creator,
        package: packageData,
        // deposit: value.deposit || null,
      });

      //   creator: value.creator,
      //   // deposit: value.deposit || null,
      //   package: value.package ? createMemPackage(value.package) : undefined,
      // });
      return Any.create({
        type_url: MsgEndpoint.MSG_ADD_PKG,
        value: MsgAddPackage.encode(msgAddPackage).finish(),
      });
    }
    case MsgEndpoint.MSG_CALL: {
      const args: string[] = message.value.args ? (message.value.args.length === 0 ? null : message.value.args) : null;
      const result = MsgCall.create({
        args: args,
        caller: message.value.caller,
        func: message.value.func,
        pkg_path: message.value.pkg_path,
        send: message.value.send || "",
        max_deposit: "",
      });
      return Any.create({
        type_url: MsgEndpoint.MSG_CALL,
        value: MsgCall.encode(result).finish(),
      });
    }
    case MsgEndpoint.MSG_SEND: {
      return Any.create({
        type_url: MsgEndpoint.MSG_SEND,
        value: MsgSend.encode(MsgSend.create(message.value)).finish(),
      });
    }
    case MsgEndpoint.MSG_RUN: {
      const value = message.value as MsgRun;
      const packageData = value.package
        ? {
            name: value.package.name,
            path: value.package.path,
            files: value.package.files.map(file => ({
              name: file.name,
              body: file.body,
            })),
          }
        : undefined;

      const msgRun = MsgRun.create({
        caller: value.caller,
        package: packageData,
        send: value.send || "0ugnot",
      });
      return Any.create({
        type_url: MsgEndpoint.MSG_RUN,
        value: MsgRun.encode(msgRun).finish(),
      });
    }
    default: {
      return Any.create({
        type_url: MsgEndpoint.MSG_CALL,
        value: MsgCall.encode(MsgCall.fromJSON(message.value)).finish(),
      });
    }
  }
}
