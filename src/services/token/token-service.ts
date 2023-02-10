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
import {
	ExchangeRateModel,
	ExchangeRateToBigNumType,
} from "@/models/token/exchange-rate-model";
import { TokenDefaultModel } from "@/models/token/token-default-model";
import { TokenPairModel } from "@/models/token/token-pair-model";

export class TokenService {
	private tokenRepository: TokenRepository;

	private exchangeRates: Array<ExchangeRateToBigNumType> = [];

	private usdRate: BigNumber = BigNumber(0);

	constructor(tokenRepository: TokenRepository) {
		this.tokenRepository = tokenRepository;
		this.init();
	}

	private init = async () => {
		const tokenId = "1";
		this.exchangeRates = (await this.getAllExchangeRates(tokenId))?.rates ?? [];
		this.usdRate = BigNumber(
			(await this.getUSDExchangeRate(tokenId))?.rate ?? 1,
		);
	};

	public getTokenRate = (
		token0: TokenDefaultModel,
		token1: TokenDefaultModel,
	) => {
		const token0Rate =
			this.exchangeRates.find(rate => rate.tokenId === token0.tokenId)?.rate ??
			1;
		const token1Rate =
			this.exchangeRates.find(rate => rate.tokenId === token1.tokenId)?.rate ??
			1;

		return BigNumber(token1Rate).dividedBy(token0Rate);
	};

	public getTokenUSDRate = async (token: TokenDefaultModel) => {
		const gnotToken = await this.getTokenById("1");
		if (!gnotToken) {
			throw new Error("");
		}
		const toGnotRate = this.getTokenRate(token, gnotToken);

		return BigNumber(token.amount?.value ?? 0)
			.multipliedBy(toGnotRate)
			.multipliedBy(this.usdRate);
	};

	public getTokenPairUSDRate = async (tokenPair: TokenPairModel) => {
		const { token0, token1 } = tokenPair;
		const token0Rate = await this.getTokenUSDRate(token0);
		const token1Rate = await this.getTokenUSDRate(token1);

		return token0Rate
			.multipliedBy(token0.amount?.value ?? 0)
			.plus(token1Rate.multipliedBy(token1.amount?.value ?? 0));
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
