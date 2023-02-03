import { StatusOptions } from "@/common/values/data-constant";

export interface AccountHistoryModel {
	hits: number;
	total: number;
	txs: Array<TransactionModel>;
}

interface TransactionModel {
	txHash: string;
	txLogo: string[];
	desc: string;
	status: StatusOptions;
	createdAt: string;
}
