import { InjectResponse } from "./inject-response";

interface Transaction {
	messages: Array<TransactionMessage>;
	gasFee: number;
	gasWanted: number;
	memo?: string;
}

interface TransactionMessage {
	type: string;
	value: any;
}

export interface InjectSendTransactionRequest {
	sendTransaction: (transaction: Transaction) => Promise<InjectResponse<any>>;
}
