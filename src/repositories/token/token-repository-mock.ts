import {
	TokenDetailListResponse,
	TokenListResponse,
	TokenRepository,
	TokenResponse,
} from ".";

export class TokenRepositoryMock implements TokenRepository {
	public getTokens = async (option: {
		keyword?: string | undefined;
		type?: string | undefined;
	}): Promise<TokenListResponse> => {
		return {};
	};

	public getTokensBySymbols = async (
		symbols: string[],
	): Promise<TokenListResponse> => {
		return {};
	};

	public getTokenDetails = async (option: {
		keyword?: string | undefined;
		type?: string | undefined;
	}): Promise<TokenDetailListResponse> => {
		return {};
	};

	public getTokenBySymbol = async (symbol: string): Promise<TokenResponse> => {
		return {};
	};
}
