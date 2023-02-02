import { StatusOptions } from "@/common/values/data-constant";

export interface AccountHistoryModel {
	hits: number;
	total: number;
	txs: Array<TransactionModel>;
}

interface TransactionModel {
	tx_hash: string;
	tx_logo: string[];
	desc: string;
	status: StatusOptions;
	created_at: string;
}
