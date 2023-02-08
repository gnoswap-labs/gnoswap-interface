import {
	ExchangeRateResponse,
	TokenDatatableResponse,
	TokenRepository,
	TokenInfoResponse,
	SummaryHighestRewardListResponse,
	SummaryRecentlyAddedListResponse,
	SummaryPopularTokenListResponse,
	TokenSearchListResponse,
	TokenMetaListResponse,
	USDExchangeRateResponse,
} from ".";

import mockTokenInfos from "./mock/token-infos.json";
import mockTokenDatatable from "./mock/token-datatable.json";
import mockTokenMetas from "./mock/token-metas.json";
import mockExchangeRate from "./mock/exchange-rates.json";
import mockSummaryHighestRewards from "./mock/summary-highest-rewards.json";
import mockSummaryPopularTokens from "./mock/summary-popular-tokens.json";
import mockSummaryRecentAdded from "./mock/summary-recent-added.json";
import mockSearchTokens from "./mock/search-tokens.json";

export class TokenRepositoryMock implements TokenRepository {
	public getAllTokenMetas = async (): Promise<TokenMetaListResponse> => {
		return mockTokenMetas;
	};

	public searchTokens = async (
		searchOption: any,
	): Promise<TokenSearchListResponse> => {
		return mockSearchTokens;
	};

	public getAllExchangeRates = async (
		tokenId: string,
	): Promise<ExchangeRateResponse> => {
		return {
			token_id: tokenId,
			rates: mockExchangeRate.rates,
		};
	};

	public getUSDExchangeRate = async (
		tokenId: string,
	): Promise<USDExchangeRateResponse> => {
		return {
			rate: 1.14,
		};
	};

	public getTokenDatatable = async (): Promise<TokenDatatableResponse> => {
		return mockTokenDatatable as TokenDatatableResponse;
	};

	public getSummaryPopularTokens =
		async (): Promise<SummaryPopularTokenListResponse> => {
			return mockSummaryPopularTokens;
		};

	public getSummaryHighestRewardTokens =
		async (): Promise<SummaryHighestRewardListResponse> => {
			return mockSummaryHighestRewards;
		};

	public getSummaryRecentlyAddedTokens =
		async (): Promise<SummaryRecentlyAddedListResponse> => {
			return mockSummaryRecentAdded;
		};

	public getTokenById = async (tokenId: string): Promise<TokenInfoResponse> => {
		const token = mockTokenInfos.tokens.find(
			token => token.token_id === tokenId,
		);
		if (!token) {
			throw new Error("Not found token");
		}
		return token;
	};
}
