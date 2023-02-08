import { amountFormatToBignum } from "@/common/utils/denom-util";
import {
	TokenSearchInfoResponse,
	TokenSearchListResponse,
} from "@/repositories/token";
import { TokenListModel } from "../token-list-model";
import { TokenDefaultModel } from "../token-default-model";

export class TokenSearchListMapper {
	public static fromResponse(
		response: TokenSearchListResponse,
	): TokenListModel {
		const { hits, total, tokens } = response;
		return {
			hits,
			total,
			tokens: tokens.map(TokenSearchListMapper.mappedTokenKeyValue),
		};
	}

	private static mappedTokenKeyValue(
		t: TokenSearchInfoResponse,
	): TokenDefaultModel {
		return {
			tokenId: t.token_id,
			name: t.name,
			symbol: t.symbol,
			amount: amountFormatToBignum(t.amount),
		};
	}
}
