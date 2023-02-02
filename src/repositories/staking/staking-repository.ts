import { StakeRequest } from "./request";
import {
	StakeResponse,
	StakingListResponse,
	UnstakeResponse,
	StakingPeriodListResponse,
} from "./response";

export interface StakingRepository {
	getStakingPeriods: () => Promise<StakingPeriodListResponse>;

	getStakesByAddress: (address: string) => Promise<StakingListResponse>;

	getStakesByAddressAndPoolId: (
		address: string,
		poolId: string,
	) => Promise<StakingListResponse>;

	stake: (request: StakeRequest) => Promise<StakeResponse>;

	unstake: (request: StakeRequest) => Promise<UnstakeResponse>;
}
