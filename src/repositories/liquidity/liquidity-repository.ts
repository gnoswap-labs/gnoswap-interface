import {
	AddLiquidityRequest,
	ClaimRewardReqeust,
	RemoveLiquidityRequest,
} from "./request";
import {
	AddLiquidityResponse,
	ClaimRewardResponse,
	LiquidityDetailInfoResponse,
	LiquidityDetailListResponse,
	LiquidityRewardResponse,
	RemoveLiquidityResponse,
} from "./response";

export interface LiquidityRepository {
	getLiquidityById: (
		liquidityId: string,
	) => Promise<LiquidityDetailInfoResponse>;

	getLiquiditiesByAddress: (
		address: string,
	) => Promise<LiquidityDetailListResponse>;

	getAvailStakeLiquiditiesBy: (
		poolId: string,
		period: number,
		address: string,
	) => Promise<LiquidityDetailListResponse>;

	getAvailUnstakeLiquiditiesBy: (
		poolId: string,
		period: number,
		address: string,
	) => Promise<LiquidityDetailListResponse>;

	addLiquidityBy: (
		request: AddLiquidityRequest,
	) => Promise<AddLiquidityResponse>;

	removeLiquiditiesBy: (
		request: RemoveLiquidityRequest,
	) => Promise<RemoveLiquidityResponse>;

	getLiquidityRewardByAddressAndPoolId: (
		address: string,
		poolId: string,
	) => Promise<LiquidityRewardResponse>;

	claimRewardByPoolId: (poolId: string) => Promise<ClaimRewardResponse>;
}
