import { StakeRequest } from "./request";
import { UnstakeRequest } from "./request/unstake-request";
import {
	StakeResponse,
	StakingListResponse,
	UnstakeResponse,
	StakingPeriodListResponse,
} from "./response";

export interface StakingRepository {
	getStakingPeriods: (poolId: string) => Promise<StakingPeriodListResponse>;

	stakeBy: (request: StakeRequest) => Promise<StakeResponse>;

	unstakeBy: (request: UnstakeRequest) => Promise<UnstakeResponse>;
}
