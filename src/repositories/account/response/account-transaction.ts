export interface AccountTransactionResponse {
	total: number;
	hits: number;
	txs: Array<AccountTransaction>;
}

interface AccountTransaction {
	tx_hash: string;
	logo: string;
	description: string;
	status: "SUCCESS" | "FAILED" | "PENDING";
	created_at: string;
}
