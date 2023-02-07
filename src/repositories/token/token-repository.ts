import {
	TokenDatatableResponse,
	TokenInfoResponse,
	SummaryPopularTokenListResponse,
	SummaryHighestRewardListResponse,
	SummaryRecentlyAddedListResponse,
	TokenSearchListResponse,
	ExchangeRateResponse,
	TokenMetaListResponse,
} from "./response";

interface SearchOption {
	keyword: string;
	type: string;
}

interface PageOption {
	page?: number;
	limit?: number;
}

export interface TokenRepository {
	getAllTokenMetas: () => Promise<TokenMetaListResponse>;

	getExchangeRateByTokenId: (tokenId: string) => Promise<ExchangeRateResponse>;

	searchTokens: (
		searchOption: SearchOption,
	) => Promise<TokenSearchListResponse>;

	getTokenDatatable: (option: {
		keyword?: string;
		type?: string;
		address?: string;
	}) => Promise<TokenDatatableResponse>;

	getRecentSearchTokensByAddress: (
		address: string,
	) => Promise<TokenDatatableResponse>;

	getSummaryPopularTokens: () => Promise<SummaryPopularTokenListResponse>;

	getSummaryHighestRewardTokens: () => Promise<SummaryHighestRewardListResponse>;

	getSummaryRecentlyAddedTokens: () => Promise<SummaryRecentlyAddedListResponse>;

	getTokenById: (tokenId: string) => Promise<TokenInfoResponse>;
}
