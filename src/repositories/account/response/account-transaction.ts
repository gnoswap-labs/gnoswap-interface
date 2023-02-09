import { StatusOptions } from "@/common/values/data-constant";

export interface AccountTransactionResponse {
	txs: Array<AccountTransaction>;
}

interface AccountTransaction {
	tx_hash: string;
	logo: string;
	description: string;
	status: "SUCCESS" | "FAILED" | "PENDING";
	created_at: string;
}
