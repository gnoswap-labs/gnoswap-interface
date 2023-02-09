import { ExchangeRateMapper } from "./../../models/token/mapper/exchange-rate-mapper";
import { TokenSearchListMapper } from "@/models/token/mapper/token-search-list-mapper";
import { RecentlyAddedMapper } from "@/models/statistical-data/mapper/recently-added-mapper";
import { HighestRewardMapper } from "@/models/statistical-data/mapper/highest-reward-mapper";
import { PopularTokenMapper } from "@/models/statistical-data/mapper/popular-token-mapper";
import { TokenDatatableMapper } from "@/models/token/mapper/token-datatable-mapper";
import { TokenRepository } from "@/repositories/token";
import { TokenModelMapper } from "@/models/token/mapper/token-model-mapper";
import { returnNullWithLog } from "@/common/utils/error-util";
import { TokenTableSelectType } from "@/common/values/data-constant";
import { TokenTableModel } from "@/models/datatable/token-table-model";
import { TokenSearchItemType } from "@/models/token/token-search-list-model";
import BigNumber from "bignumber.js";

export class TokenService {
	private tokenRepository: TokenRepository;

	constructor(tokenRepository: TokenRepository) {
		this.tokenRepository = tokenRepository;
	}

	public getExchangeRateByAllTokens = async () => {
		/**
		 * 1. 토큰 메타데이터 가져오기
		 * 2. 토큰 별 환율정보 가져오기 (getAllExchangeRates) - 기준 'GNOT'
		 *
		 * 		rates: [
		 * 			{
		 * 				tokenId: 2, // ETH
		 * 				rate: 1.4
		 * 			},
		 * 			{
		 * 				tokenId: 3 // GNOS - 우리가 발생할 토큰
		 * 				rate: 14.2
		 * 			}
		 * 		]
		 *
		 * 3. 달러 가치를 가져오기 (getUSDExchangeRate) - 기준 'GNOT'
		 * 		{
		 * 			value: 1.5
		 * 		}
		 * 		1.5(GNOT 달러가치) * 1.4(GNOT 대비 ETH 가치) => ETH Dollar
		 */
	};

	public getAllExchangeRates = async (tokenId: string) => {
		return await this.tokenRepository
			.getAllExchangeRates(tokenId)
			.then(ExchangeRateMapper.fromResponse)
			.catch(returnNullWithLog);
	};

	public getUSDExchangeRate = async (tokenId: string) => {
		return await this.tokenRepository
			.getUSDExchangeRate(tokenId)
			.catch(returnNullWithLog);
	};

	public getTokenById = async (tokenId: string) => {
		return await this.tokenRepository
			.getTokenById(tokenId)
			.then(TokenModelMapper.fromResponse)
			.catch(returnNullWithLog);
	};

	public getTokenDatatable = async (type: TokenTableSelectType = "ALL") => {
		if (type === "GRC20") {
			return await this.getGRC20TokenDatatable().catch(returnNullWithLog);
		}

		return await this.getAllTokenDatatable().catch(returnNullWithLog);
	};

	private getAllTokenDatatable = async () => {
		return await this.tokenRepository
			.getTokenDatatable()
			.then(TokenDatatableMapper.fromResponse);
	};

	private getGRC20TokenDatatable = async () => {
		return await this.getAllTokenDatatable().then(res => ({
			...res,
			tokens: res.tokens.filter(token => token.type === "GRC20"),
		}));
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
			.catch(returnNullWithLog);
	};

	private searchTokenKeywordFilter = async (
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
			.catch(returnNullWithLog);
	};

	public getHighestRewardTokens = async () => {
		return await this.tokenRepository
			.getSummaryHighestRewardTokens()
			.then(HighestRewardMapper.fromResponse)
			.catch(returnNullWithLog);
	};

	public getRecentlyAddedTokens = async () => {
		return await this.tokenRepository
			.getSummaryRecentlyAddedTokens()
			.then(RecentlyAddedMapper.fromResponse)
			.catch(returnNullWithLog);
	};

	public searchTokens = async (keyword: string) => {
		return await this.tokenRepository
			.searchTokens(keyword)
			.then(TokenSearchListMapper.fromResponse)
			.catch(returnNullWithLog);
	};

	public createSearchLog = async (searchToken: TokenSearchItemType) => {
		return this.tokenRepository.createSearchLog(searchToken);
	};

	public getSearchLogs = () => {
		return this.tokenRepository.getSearchLogs();
	};
}
