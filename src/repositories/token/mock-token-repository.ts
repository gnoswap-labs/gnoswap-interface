import {
	generateId,
	generateInteger,
	generateNumber,
	generateToken0,
	generateTokenMetas,
} from "@/common/utils/test-util";
import {
	TokenListResponse,
	TokenRepository,
	TokenInfoResponse,
	SummaryHighestRewardListResponse,
	SummaryRecentlyAddedListResponse,
	SummaryPopularTokenListResponse,
	TokenSearchListResponse,
} from ".";

export class MockTokenRepository implements TokenRepository {
	public searchTokens = async (
		searchOption: any,
	): Promise<TokenSearchListResponse> => {
		return {
			hits: 0,
			total: 0,
			tokens: [],
		};
	};

	public getTokens = async (): Promise<TokenListResponse> => {
		return MockTokenRepository.generateTokens();
	};

	public getRecentSearchTokensByAddress = async (
		address: string,
	): Promise<TokenListResponse> => {
		return MockTokenRepository.generateTokens();
	};

	public getSummaryPopularTokens =
		async (): Promise<SummaryPopularTokenListResponse> => {
			return {
				hits: 0,
				total: 0,
				tokens: [],
			};
		};

	public getSummaryHighestRewardTokens =
		async (): Promise<SummaryHighestRewardListResponse> => {
			return {
				hits: 0,
				total: 0,
				pairs: [],
			};
		};

	public getSummaryRecentlyAddedTokens =
		async (): Promise<SummaryRecentlyAddedListResponse> => {
			return {
				hits: 0,
				total: 0,
				pairs: [],
			};
		};

	public getTokenById = async (tokenId: string): Promise<TokenInfoResponse> => {
		const { names } = generateTokenMetas();
		return {
			token_id: generateId(),
			name: names[0],
			symbol: names[0],
			amount: {
				value: generateNumber(100, 500000),
				denom: names[0],
			},
		};
	};

	private static generateTokens = () => {
		const tokens = [...new Array(generateInteger(5, 40))].map(
			MockTokenRepository.generateToken,
		);
		return {
			hits: tokens.length,
			total: tokens.length,
			tokens,
		};
	};

	private static generateToken = () => {
		const { names } = generateTokenMetas();
		const graph = new Array(20).map(_ => generateNumber(0, 100));
		return {
			name: names[0],
			symbol: names[0],
			type: "native",
			price: generateNumber(100, 500000),
			balance: generateNumber(100, 500000),
			usd_value: generateNumber(100, 500000),
			price_of_1h: generateNumber(100, 500000),
			price_of_24h: generateNumber(100, 500000),
			price_of_7d: generateNumber(100, 500000),
			m_cap: generateNumber(100, 500000),
			tvl: generateNumber(100, 500000),
			volume: generateNumber(100, 500000),
			most_liquidity_pool: MockTokenRepository.generateTokenPair(),
			graph,
		};
	};

	private static generateTokenPair = () => {
		const { names } = generateTokenMetas();
		return {
			token0: {
				token_id: `${generateNumber(100, 500000)}`,
				name: names[0],
				symbol: names[0],
			},
			token1: {
				token_id: `${generateNumber(100, 500000)}`,
				name: names[1],
				symbol: names[1],
			},
			fee_tier: 0.3,
			apr: generateNumber(0, 100),
		};
	};
}
