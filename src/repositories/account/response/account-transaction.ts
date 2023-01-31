export interface AccountTransactionResponse {
	transactions: Array<AccountTransaction>;
}

interface AccountTransaction {
	tx_logo: string;
	tx_hash: string;
	desc: string;
	status: "success" | "pending" | "failed";
	created_at: string;
}
