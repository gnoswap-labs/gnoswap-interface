import { TokenSearchListMapper } from "@/models/token/mapper/token-search-list-mapper";
import { RecentlyAddedMapper } from "@/models/statistical-data/mapper/recently-added-mapper";
import { HighestRewardMapper } from "@/models/statistical-data/mapper/highest-reward-mapper";
import { PopularTokenMapper } from "@/models/statistical-data/mapper/popular-token-mapper";
import { TokenDatatableMapper } from "@/models/token/mapper/token-datatable-mapper";
import { TokenRepository } from "@/repositories/token";
import { TokenModelMapper } from "@/models/token/mapper/token-model-mapper";
import { returnNullWithLog } from "@/common/utils/error-util";
import { SearchOption } from "@/common/types/data-prop-types";
import { TokenTableSelectType } from "@/common/values/data-constant";

export class TokenService {
	private tokenRepository: TokenRepository;

	constructor(tokenRepository: TokenRepository) {
		this.tokenRepository = tokenRepository;
	}

	public getExchangeRateByAllTokens = async () => {};

	public getTokenById = async (tokenId: string) => {
		return await this.tokenRepository
			.getTokenById(tokenId)
			.then(TokenModelMapper.fromResponse)
			.catch(returnNullWithLog);
	};

	public getTokenDatatable = async (type?: TokenTableSelectType) => {
		if (type === "GRC20") {
			return this.getGRC20TokenDatatable().catch(returnNullWithLog);
		}

		return this.getAllTokenDatatable().catch(returnNullWithLog);
	};

	private getAllTokenDatatable = async () => {
		return await this.tokenRepository
			.getTokenDatatable()
			.then(TokenDatatableMapper.fromResponse);
	};

	private getGRC20TokenDatatable = async () => {
		return await this.getAllTokenDatatable().then(res =>
			res.tokens.filter(token => token.type === "GRC20"),
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

	public getSearchTokens = async (searchOption: SearchOption) => {
		return await this.tokenRepository
			.searchTokens(searchOption)
			.then(TokenSearchListMapper.fromResponse)
			.catch(returnNullWithLog);
	};

	public getRecentSearchTokensByAddess = async () => {};
}
