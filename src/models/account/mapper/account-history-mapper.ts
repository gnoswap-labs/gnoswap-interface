import { StatusOptions } from "@/common/values/data-constant";
import { AccountTransactionResponse } from "@/repositories/account";
import BigNumber from "bignumber.js";
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
					tx_hash: "",
					tx_logo: [""],
					desc: "",
					status: "SUCCESS",
					created_at: "",
				},
			],
		};
	}
}
