import { TokenError } from "@/common/errors/token/token-error";
import { returnErrorResponse } from "@/common/utils/error-util";
import { TokenMetaMapper } from "@/models/token/mapper/token-meta-mapper";
import { ExchangeRateMapper } from "@/models/token/mapper/exchange-rate-mapper";
import { TokenSearchListMapper } from "@/models/token/mapper/token-search-list-mapper";
import { RecentlyAddedMapper } from "@/models/statistical-data/mapper/recently-added-mapper";
import { HighestRewardMapper } from "@/models/statistical-data/mapper/highest-reward-mapper";
import { PopularTokenMapper } from "@/models/statistical-data/mapper/popular-token-mapper";
import { TokenDatatableMapper } from "@/models/token/mapper/token-datatable-mapper";
import { TokenDatatableResponse, TokenRepository } from "@/repositories/token";
import { TokenModelMapper } from "@/models/token/mapper/token-model-mapper";
import { TokenTableSelectType } from "@/common/values/data-constant";
import { TokenTableModel } from "@/models/datatable/token-table-model";
import { TokenSearchItemType } from "@/models/token/token-search-list-model";

export class TokenService {
	private tokenRepository: TokenRepository;

	constructor(tokenRepository: TokenRepository) {
		this.tokenRepository = tokenRepository;
	}

	public getAllTokenMetas = async () => {
		return await this.tokenRepository
			.getAllTokenMetas()
			.then(TokenMetaMapper.fromResponse)
			.catch(() =>
				returnErrorResponse(new TokenError("NOT_FOUND_TOKEN_METAS")),
			);
	};

	public getAllExchangeRates = async (tokenId: string) => {
		return await this.tokenRepository
			.getAllExchangeRates(tokenId)
			.then(ExchangeRateMapper.fromResponse)
			.catch(() =>
				returnErrorResponse(new TokenError("NO_MATCH_TOKENID_FOR_EX_RATE")),
			);
	};

	public getUSDExchangeRate = async (tokenId: string) => {
		return await this.tokenRepository
			.getUSDExchangeRate(tokenId)
			.catch(() =>
				returnErrorResponse(new TokenError("NO_MATCH_TOKENID_FOR_USD_RATE")),
			);
	};

	public getTokenById = async (tokenId: string) => {
		return await this.tokenRepository
			.getTokenById(tokenId)
			.then(TokenModelMapper.fromResponse)
			.catch(() => returnErrorResponse(new TokenError("NO_MATCH_TOKENID")));
	};

	public getTokenDatatable = async (type: TokenTableSelectType = "ALL") => {
		const isGRC20 = type === "GRC20";
		return await this.tokenRepository
			.getTokenDatatable()
			.then(res => (isGRC20 ? this.filterGRC20TokenDatatable(res) : res))
			.then(TokenDatatableMapper.fromResponse)
			.catch(() =>
				returnErrorResponse(
					new TokenError(
						`NO_TOKEN_DATATABLE_TYPE_${isGRC20 ? "GRC20" : "ALL"}`,
					),
				),
			);
	};

	private filterGRC20TokenDatatable = (res: TokenDatatableResponse) => {
		const GRC20Tokens = res?.tokens.filter(token => token.type === "GRC20");
		return {
			hits: GRC20Tokens.length,
			total: GRC20Tokens.length,
			tokens: GRC20Tokens,
		};
	};

	public getSearchTokenDatatable = async (
		keyword: string,
		type: TokenTableSelectType = "ALL",
	) => {
		return await this.getTokenDatatable(type)
			.then(res =>
				this.searchTokenKeywordFilter(keyword, res as TokenTableModel),
			)
			.catch(() =>
				returnErrorResponse(new TokenError("NO_SEARCH_TOKEN_DATATABLE")),
			);
	};

	private searchTokenKeywordFilter = (
		keyword: string,
		data: TokenTableModel,
	) => {
		console.log("data : ", data);
		const searchTokens = data?.tokens.filter(
			token => token.name.includes(keyword) || token.symbol.includes(keyword),
		);
		return {
			hits: searchTokens.length,
			total: searchTokens.length,
			tokens: searchTokens,
		};
	};

	public getPopularTokens = async () => {
		return await this.tokenRepository
			.getSummaryPopularTokens()
			.then(PopularTokenMapper.fromResponse)
			.catch(() =>
				returnErrorResponse(new TokenError("NOT_FOUND_POPULAR_TOKENS")),
			);
	};

	public getHighestRewardTokens = async () => {
		return await this.tokenRepository
			.getSummaryHighestRewardTokens()
			.then(HighestRewardMapper.fromResponse)
			.catch(() =>
				returnErrorResponse(new TokenError("NOT_FOUND_HIGHEST_TOKENS")),
			);
	};

	public getRecentlyAddedTokens = async () => {
		return await this.tokenRepository
			.getSummaryRecentlyAddedTokens()
			.then(RecentlyAddedMapper.fromResponse)
			.catch(() =>
				returnErrorResponse(new TokenError("NOT_FOUND_RECENTLY_TOKENS")),
			);
	};

	public searchTokens = async (keyword: string) => {
		return await this.tokenRepository
			.searchTokens(keyword)
			.then(TokenSearchListMapper.fromResponse)
			.catch(() => returnErrorResponse(new TokenError("NO_SEARCH_TOKEN")));
	};

	public createSearchLog = (searchToken: TokenSearchItemType) => {
		return this.tokenRepository.createSearchLog(searchToken);
	};

	public getSearchLogs = () => {
		return this.tokenRepository.getSearchLogs();
	};
}
