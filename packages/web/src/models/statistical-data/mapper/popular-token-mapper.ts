import {
	PopularTokenModel,
	SummaryPopularTokenType,
} from "./../popular-token-model";
import {
	PopularTokenInfo,
	SummaryPopularTokenListResponse,
} from "./../../../repositories/token/response/summary-popular-token-list-response";

export class PopularTokenMapper {
	public static fromResponse(
		response: SummaryPopularTokenListResponse,
	): PopularTokenModel {
		const { hits, total, tokens } = response;
		return {
			hits,
			total,
			tokens: tokens.map(PopularTokenMapper.mappedTokenKeyValue),
		};
	}

	private static mappedTokenKeyValue(
		t: PopularTokenInfo,
	): SummaryPopularTokenType {
		return {
			tokenId: t.token_id,
			name: t.name,
			symbol: t.symbol,
			change24h: t.change_24h,
		};
	}
}
