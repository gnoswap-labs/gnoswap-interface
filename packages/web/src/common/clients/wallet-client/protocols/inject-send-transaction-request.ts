import { InjectResponse } from "./inject-response";

export interface InjectSendTransactionRequestParam {
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
	sendTransaction: (
		transaction: InjectSendTransactionRequestParam,
	) => Promise<InjectResponse<any>>;
}
