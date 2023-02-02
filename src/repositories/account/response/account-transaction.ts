import { StatusOptions } from "@/common/values/data-constant";

export interface AccountTransactionResponse {
	transactions: Array<AccountTransaction>;
}

interface AccountTransaction {
	tx_logo: string;
	tx_hash: string;
	desc: string;
	status: StatusOptions;
	created_at: string;
}
