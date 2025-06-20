import { Tx } from "@gnolang/tm2-js-client";
import { Document } from "src/types/transaction-messages.types";

import { CreateTransactionDocumentParameters } from "./request";
import { EncodeTxSignature } from "./types";

export interface TransactionService {
  createDocument(request: CreateTransactionDocumentParameters): Promise<Document>;

  createTransaction(document: Document): Promise<{ signed: Tx; signature: EncodeTxSignature[] }>;
}
