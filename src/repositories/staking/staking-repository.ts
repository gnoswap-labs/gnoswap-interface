import { StakeRequest } from "./request";
import {
	LpTokenDetailInfoResponse,
	LpTokenListResponse,
	StakeResponse,
	StakingListResponse,
	TotalStakingResultResponse,
	TotalUnstakingResultResponse,
	UnstakeResponse,
	UnstakingPeriodInfoResponse,
} from "./response";

export interface StakingRepository {
	getUnstakingPeriods: () => Promise<UnstakingPeriodInfoResponse>;

	getLPTokensByAddress: (address: string) => Promise<LpTokenListResponse>;

	getLPTokenDetailByTokenId: (
		tokenId: string,
	) => Promise<LpTokenDetailInfoResponse>;

	getStakesByAddress: (address: string) => Promise<StakingListResponse>;

	getTotalStakingResultBy: (
		period: string,
		tokenIds: Array<string>,
	) => Promise<TotalStakingResultResponse>;

	stake: (request: StakeRequest) => Promise<StakeResponse>;

	getTotalUnstakingResultBy: (
		period: string,
		tokenIds: Array<string>,
	) => Promise<TotalUnstakingResultResponse>;

	unstake: (request: StakeRequest) => Promise<UnstakeResponse>;
}
