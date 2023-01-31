import {
	LpTokenDetailInfoResponse,
	LpTokenListResponse,
	StakeResponse,
	StakingListResponse,
	StakingRepository,
	TotalStakingResultResponse,
	TotalUnstakingResultResponse,
	UnstakeResponse,
	UnstakingPeriodInfoResponse,
} from ".";
import { StakeRequest } from "./request";

export class StakingRepositoryMock implements StakingRepository {
	public getUnstakingPeriods =
		async (): Promise<UnstakingPeriodInfoResponse> => {
			return {};
		};

	public getLPTokensByAddress = async (
		address: string,
	): Promise<LpTokenListResponse> => {
		return {};
	};

	public getLPTokenDetailByTokenId = async (
		tokenId: string,
	): Promise<LpTokenDetailInfoResponse> => {
		return {};
	};

	public getStakesByAddress = async (
		address: string,
	): Promise<StakingListResponse> => {
		return {};
	};

	public getTotalStakingResultBy = async (
		period: string,
		tokenIds: string[],
	): Promise<TotalStakingResultResponse> => {
		return {};
	};

	public stake = async (request: StakeRequest): Promise<StakeResponse> => {
		return {};
	};

	public getTotalUnstakingResultBy = async (
		period: string,
		tokenIds: string[],
	): Promise<TotalUnstakingResultResponse> => {
		return {};
	};

	public unstake = async (request: StakeRequest): Promise<UnstakeResponse> => {
		return {};
	};
}
