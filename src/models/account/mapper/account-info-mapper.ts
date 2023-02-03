import { AccountError } from "@/common/errors/account";
import {
	notEmptyStringType,
	notNullStringType,
} from "@/common/utils/data-check-util";
import { textToBalances } from "@/common/utils/denom-util";
import { ActiveStatusOptions } from "@/common/values/data-constant";
import { AccountInfoResponse } from "@/repositories/account";
import BigNumber from "bignumber.js";
import { AccountInfoModel } from "../account-info-model";

export class AccountInfoMapper {
	public static fromResopnse(response: AccountInfoResponse): AccountInfoModel {
		if (!notNullStringType(response.coins)) {
			throw new AccountError("COIN_TYPE_ERROR");
		}
		if (!notEmptyStringType(response.address)) {
			throw new AccountError("NOT_FOUND_ADDRESS");
		}
		const balances = textToBalances(response.coins);
		const balance =
			balances.length > 0 ? balances[0] : { value: BigNumber(0), denom: "" };
		return {
			address: response.address,
			amount: balance,
			status: response.status as ActiveStatusOptions,
		};
	}
}
