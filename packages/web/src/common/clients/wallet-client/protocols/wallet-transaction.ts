import { Provider, Tx, TxSignature } from "@gnolang/tm2-js-client";
import { Document } from "src/types/transaction-messages.types";
import { WalletResponse } from "./wallet-response";

export interface WalletTransactionMethod {
  sign: (
    provider: Provider,
    document: Document,
  ) => Promise<{
    signed: Tx;
    signature: TxSignature[];
  }>;
  sendTransaction: (
    transaction: SendTransactionRequestParam,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;
}

export interface SendTransactionRequestParam {
  messages: Array<TransactionMessage>;
  gasFee: number;
  gasWanted?: number;
  memo?: string;
}

/**
 * Transaction Request Message
 */
export type TransactionMessage =
  | TransactionMessageOfBankMsgSend
  | TransactionMessageOfContract
  | TransactionMessageOfRun;

export interface TransactionMessageOfBankMsgSend {
  from_address: string;
  to_address: string;
  amount: string;
}

export interface TransactionMessageOfContract {
  caller: string;
  send: string;
  pkg_path: string;
  func: string;
  args: (string | number | boolean)[] | null;
}

/**
 * Single gno source file of an ephemeral `MsgRun` package.
 */
export interface TransactionMessageOfRunFile {
  name: string;
  body: string;
}

/**
 * Ephemeral package executed by `MsgRun`.
 *
 * The node requires the package name to be "main" and auto-assigns the reserved
 * run path (`gno.land/e/<caller>/run`) when the path is left empty.
 */
export interface TransactionMessageOfRunPackage {
  name: string;
  path: string;
  files: TransactionMessageOfRunFile[];
}

export interface TransactionMessageOfRun {
  caller: string;
  send: string;
  package: TransactionMessageOfRunPackage;
}

/**
 * Send Transaction Response
 */
export type SendTransactionResponse<T = unknown> = SendTransactionSuccessResponse<T> | SendTransactionErrorResponse;

export interface SendTransactionSuccessResponse<T = unknown> {
  hash: string;
  height: string;
  data: T;
}

export interface SendTransactionErrorResponse {
  hash: string;
  type: string;
  message: string;
}

export function isContractMessage(message: TransactionMessage): message is TransactionMessageOfContract {
  return "func" in message;
}

export function isRunMessage(message: TransactionMessage): message is TransactionMessageOfRun {
  return "package" in message;
}
