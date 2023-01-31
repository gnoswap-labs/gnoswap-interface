import { StakeRequest } from "./request";
import {
	LpTokenDetailInfoResponse,
	LpTokenListResponse,
	StakeResponse,
	StakingListResponse,
	TotalStakingResultResponse,
	TotalUnstakingResultResponse,
	UnstakeResponse,
	StakingPeriodListResponse,
} from "./response";

export interface StakingRepository {
	getStakingPeriods: () => Promise<StakingPeriodListResponse>;

	getLPTokensByAddress: (address: string) => Promise<LpTokenListResponse>;

	getLPTokenDetailBy: (
		liquidityId: string,
		address: string,
	) => Promise<LpTokenDetailInfoResponse>;

	getStakesByAddress: (address: string) => Promise<StakingListResponse>;

	getTotalStakingResultBy: (
		liquidityIds: Array<string>,
		period: string,
	) => Promise<TotalStakingResultResponse>;

	stake: (request: StakeRequest) => Promise<StakeResponse>;

	getTotalUnstakingResultBy: (
		liquidityIds: Array<string>,
		period: string,
	) => Promise<TotalUnstakingResultResponse>;

	unstake: (request: StakeRequest) => Promise<UnstakeResponse>;
}
