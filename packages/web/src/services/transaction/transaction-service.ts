import { Document } from "src/types/transaction-messages.types";

import { CreateTransactionDocumentParameters } from "./request";

export interface TransactionService {
  createDocument(request: CreateTransactionDocumentParameters): Promise<Document>;
}
