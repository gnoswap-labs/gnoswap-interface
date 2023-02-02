import {
	TokenListResponse,
	TokenInfoResponse,
	SummaryPopularTokenListResponse,
	SummaryHighestRewardListResponse,
	SummaryRecentlyAddedListResponse,
	TokenSearchListResponse,
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
	searchTokens: (
		searchOption: SearchOption,
	) => Promise<TokenSearchListResponse>;

	getTokens: (option: {
		keyword?: string;
		type?: string;
		address?: string;
	}) => Promise<TokenListResponse>;

	getRecentSearchTokensByAddress: (
		address: string,
	) => Promise<TokenListResponse>;

	getSummaryPopularTokens: () => Promise<SummaryPopularTokenListResponse>;

	getSummaryHighestRewardTokens: () => Promise<SummaryHighestRewardListResponse>;

	getSummaryRecentlyAddedTokens: () => Promise<SummaryRecentlyAddedListResponse>;

	getTokenById: (tokenId: string) => Promise<TokenInfoResponse>;
}
