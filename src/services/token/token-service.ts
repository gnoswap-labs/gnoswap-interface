import { TokenError } from "@/common/errors/token/token-error";
import { returnErrorResponse } from "@/common/utils/error-util";
import { TokenMetaMapper } from "@/models/token/mapper/token-meta-mapper";
import { ExchangeRateMapper } from "@/models/token/mapper/exchange-rate-mapper";
import { TokenSearchListMapper } from "@/models/token/mapper/token-search-list-mapper";
import { RecentlyAddedMapper } from "@/models/statistical-data/mapper/recently-added-mapper";
import { HighestRewardMapper } from "@/models/statistical-data/mapper/highest-reward-mapper";
import { PopularTokenMapper } from "@/models/statistical-data/mapper/popular-token-mapper";
import { TokenDatatableMapper } from "@/models/token/mapper/token-datatable-mapper";
import { TokenRepository } from "@/repositories/token";
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
				returnErrorResponse(new TokenError("NOT_FOUNT_TOKEN_METAS")),
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
		if (type === "GRC20") {
			return await this.getGRC20TokenDatatable().catch(() =>
				returnErrorResponse(new TokenError("NO_TOKEN_DATATABLE_TYPE_GRC20")),
			);
		}

		return await this.getAllTokenDatatable().catch(() =>
			returnErrorResponse(new TokenError("NO_TOKEN_DATATABLE_TYPE_ALL")),
		);
	};

	private getAllTokenDatatable = async () => {
		return await this.tokenRepository
			.getTokenDatatable()
			.then(TokenDatatableMapper.fromResponse);
	};

	private getGRC20TokenDatatable = async () => {
		return await this.getAllTokenDatatable()
			.then(res => ({
				...res,
				tokens: res?.tokens.filter(token => token.type === "GRC20"),
			}))
			.catch(() =>
				returnErrorResponse(new TokenError("NO_TOKEN_DATATABLE_TYPE_GRC20")),
			);
	};

	public getSearchTokenDatatable = async ({
		keyword,
		type = "ALL",
	}: {
		keyword: string;
		type: TokenTableSelectType;
	}) => {
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
		return data?.tokens.filter(
			token => token.name.includes(keyword) || token.symbol.includes(keyword),
		);
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
