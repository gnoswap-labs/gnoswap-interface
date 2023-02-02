import { textToBalances } from "@/common/utils/denom-util";
import { StatusOptions } from "@/common/values/data-constant";
import { AccountInfoResposne } from "@/repositories/account";
import BigNumber from "bignumber.js";
import { AccountInfoModel } from "./account-info-model";

export class AccountInfoMapper {
	public static fromResopnse(response: AccountInfoResposne): AccountInfoModel {
		const balances = textToBalances(response.coins);
		const balance =
			balances.length > 0 ? balances[0] : { value: BigNumber(0), denom: "" };
		return {
			address: response.address,
			amount: balance,
			status: response.status as StatusOptions,
		};
	}
}
