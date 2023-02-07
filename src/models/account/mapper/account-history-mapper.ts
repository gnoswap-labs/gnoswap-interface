import { History } from "./../../../../libs/gno-client/src/api/response/transaction-history";
import { notNullStringType } from "@/common/utils/data-check-util";
import { StatusOptions } from "@/common/values/data-constant";
import { AccountTransactionResponse } from "@/repositories/account";
import { AccountHistoryModel } from "../account-history-model";

export class AccountHistoryMapper {
	public static fromResopnse(
		response: AccountTransactionResponse,
	): AccountHistoryModel {
		return {
			txs: [],
		};
	}
}
