import { AmountNumberType, AmountType } from "@/common/types/data-prop-types";
import BigNumber from "bignumber.js";
import { TokenDefaultModel } from "../token-default-model";

interface TokenResponse {
	token_id: string;
	name: string;
	symbol: string;
	amount: AmountNumberType;
}

export class TokenModelMapper {
	public static fromResponse(response: TokenResponse): TokenDefaultModel {
		const { token_id, name, symbol, amount } = response;

		return {
			tokenId: token_id,
			name,
			symbol,
			amount: TokenModelMapper.mappedAmount(amount),
		};
	}

	public static mappedAmount(response: AmountNumberType): AmountType {
		const { denom, value } = response;
		return {
			value: BigNumber(value),
			denom,
		};
	}

	public static toRequest(model: TokenDefaultModel) {
		return {
			tokenId: model.tokenId,
			amount: {
				...model.amount,
				value: model.amount.value.toString(),
			},
		};
	}
}
