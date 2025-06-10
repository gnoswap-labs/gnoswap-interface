import { TransactionMessage } from "@common/clients/wallet-client/protocols";

export interface CreateTransactionDocumentParameters {
  messages: Array<TransactionMessage>;
  gasWanted?: number;
  gasFee?: number;
  memo?: string | undefined;
}
