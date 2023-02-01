import {
	TokenDetailListResponse,
	TokenListResponse,
	TokenInfoResponse,
} from "./response";

export interface TokenRepository {
	getTokens: (option: {
		keyword?: string;
		type?: string;
		address?: string;
	}) => Promise<TokenListResponse>;

	getRecentSearchTokensByAddress: (
		address: string,
	) => Promise<TokenListResponse>;

	getPopularTokensByAddress: (address: string) => Promise<TokenListResponse>;

	getTokenDetails: (option: {
		keyword?: string;
		type?: string;
	}) => Promise<TokenDetailListResponse>;

	getTokenById: (tokenId: string) => Promise<TokenInfoResponse>;
}
