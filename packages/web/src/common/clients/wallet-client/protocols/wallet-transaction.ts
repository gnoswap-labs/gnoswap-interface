import { WalletResponse } from "./wallet-response";

export interface WalletTransactionMethod {
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
  | TransactionMessageOfContract;

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
 * Send Transaction Response
 */
export type SendTransactionResponse<T = unknown> =
  | SendTransactionSuccessResponse<T>
  | SendTransactionErrorResponse;

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

export function isContractMessage(
  message: TransactionMessageOfBankMsgSend | TransactionMessageOfContract,
): message is TransactionMessageOfContract {
  return "func" in message;
}
