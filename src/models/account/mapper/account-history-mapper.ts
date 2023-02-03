import { StatusOptions } from "@/common/values/data-constant";
import { AccountTransactionResponse } from "@/repositories/account";
import { AccountHistoryModel } from "../account-history-model";

export class AccountHistoryMapper {
	public static fromResopnse(
		response: AccountTransactionResponse,
	): AccountHistoryModel {
		return {
			hits: 0,
			total: 0,
			txs: [
				{
					txHash: "",
					txLogo: [""],
					desc: "",
					status: "SUCCESS",
					createdAt: "",
				},
			],
		};
	}
}
