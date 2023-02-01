import { generateNumber, generateTokenMetas } from "@/common/utils/test-util";
import {
	TokenDetailListResponse,
	TokenListResponse,
	TokenRepository,
	TokenInfoResponse,
} from ".";

export class TokenRepositoryMock implements TokenRepository {
	public getTokens = async (option: {
		keyword?: string | undefined;
		type?: string | undefined;
		address?: string | undefined;
	}): Promise<TokenListResponse> => {
		return TokenRepositoryMock.generateTokens();
	};

	public getRecentSearchTokensByAddress = async (
		address: string,
	): Promise<TokenListResponse> => {
		return TokenRepositoryMock.generateTokens();
	};

	public getPopularTokensByAddress = async (
		address: string,
	): Promise<TokenListResponse> => {
		return TokenRepositoryMock.generateTokens();
	};

	public getTokenDetails = async (option: {
		keyword?: string | undefined;
		type?: string | undefined;
	}): Promise<TokenDetailListResponse> => {
		return TokenRepositoryMock.generateTokens();
	};

	public getTokenById = async (tokenId: string): Promise<TokenInfoResponse> => {
		return TokenRepositoryMock.generateTokenSimple();
	};

	private static generateTokens = () => {
		const tokens = new Array(generateNumber(5, 40)).map(
			TokenRepositoryMock.generateToken,
		);
		return {
			tokens,
		};
	};

	private static generateToken = () => {
		const { images, names } = generateTokenMetas();
		const graph = new Array(20).map(_ => generateNumber(0, 100));
		return {
			token_name: names[0],
			token_symbol: names[0],
			token_type: "native",
			current_price: generateNumber(100, 500000),
			balance: generateNumber(100, 500000),
			usd_value: generateNumber(100, 500000),
			price_of_1h: generateNumber(100, 500000),
			price_of_24h: generateNumber(100, 500000),
			price_of_7d: generateNumber(100, 500000),
			m_cap: generateNumber(100, 500000),
			tvl: generateNumber(100, 500000),
			volume: generateNumber(100, 500000),
			mostLiquidPool: {
				logos: images,
				denoms: names,
				rate: "0.3",
			},
			graph,
		};
	};

	private static generateTokenSimple = () => {
		const { images, names } = generateTokenMetas();
		const graph = new Array(20).map(_ => generateNumber(0, 100));
		return {
			logo: images[0],
			name: names[0],
			symbol: names[0],
			amount: {
				value: generateNumber(1000, 500000),
				denom: names[0],
			},
		};
	};
}
