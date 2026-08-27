import { TransactionMessage } from "@common/clients/wallet-client/protocols";

export interface CreateTransactionDocumentParameters {
  messages: Array<TransactionMessage>;
  gasWanted?: number;
  gasFee?: number;
  memo?: string | undefined;
  // Skips the wallet round trip when the caller already holds the account info.
  account?: { address: string; accountNumber: number; sequence: number };
}
