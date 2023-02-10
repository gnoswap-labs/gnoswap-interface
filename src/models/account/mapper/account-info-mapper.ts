import { amountEmptyBigNumInit } from "@/common/values/global-initial-value";
import { AmountType } from "@/common/types/data-prop-types";
import { AccountError } from "@/common/errors/account";
import {
	notEmptyStringType,
	notNullStringType,
} from "@/common/utils/data-check-util";
import { textToBalances } from "@/common/utils/denom-util";
import { ActiveStatusOptions } from "@/common/values/data-constant";
import { AccountInfoResponse } from "@/repositories/account";
import { AccountInfoModel } from "../account-info-model";
import { InjectResponse } from "@/common/clients/wallet-client/protocols";

export class AccountInfoMapper {
	public static fromResopnse(
		response: InjectResponse<AccountInfoResponse>,
	): AccountInfoModel {
		const { coins, address, status } = response.data;
		if (!notNullStringType(coins)) {
			throw new AccountError("COIN_TYPE_ERROR");
		}
		if (!notEmptyStringType(address)) {
			throw new AccountError("NOT_FOUND_ADDRESS");
		}
		const balances: AmountType[] = textToBalances(coins);
		const balance = balances.length > 0 ? balances[0] : amountEmptyBigNumInit;
		return {
			address: address,
			amount: balance,
			status: status as ActiveStatusOptions,
		};
	}
}
