import { WalletResponse } from "./wallet-response";

export interface WalletTransactionMethod {
  sendTransaction: (
    transaction: SendTransactionRequestParam,
  ) => Promise<WalletResponse<SendTransactionResponse>>;
}

export interface SendTransactionRequestParam {
  messages: Array<TransactionMessage>;
  gasFee: number;
  gasWanted: number;
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
  args: string[];
}

/**
 * Send Transaction Response
 */
export type SendTransactionResponse =
  | SendTransactionSuccessResponse
  | SendTransactionErrorResponse;

export interface SendTransactionSuccessResponse {
  hash: string;
}

export interface SendTransactionErrorResponse {
  type: string;
  message: string;
}
