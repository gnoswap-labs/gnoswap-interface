import {
	TokenDetailListResponse,
	TokenListResponse,
	TokenResponse,
} from "./response";

export interface TokenRepository {
	getTokens: (option: {
		keyword?: string;
		type?: string;
	}) => Promise<TokenListResponse>;

	getTokensBySymbols: (symbols: Array<string>) => Promise<TokenListResponse>;

	getTokenDetails: (option: {
		keyword?: string;
		type?: string;
	}) => Promise<TokenDetailListResponse>;

	getTokenBySymbol: (symbol: string) => Promise<TokenResponse>;
}
