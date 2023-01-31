import { generateTxHash } from "@/common/utils/test-util";
import {
	AddLiquidityResponse,
	ClaimRewardResponse,
	LiquidityDetailInfoResponse,
	LiquidityListResponse,
	LiquidityRepository,
	LiquidityRewardResponse,
	RemoveLiquidityResponse,
} from ".";
import {
	AddLiquidityRequest,
	RemoveLiquidityRequest,
	ClaimRewardReqeust,
} from "./request";

export class LiquidityRepositoryMock implements LiquidityRepository {
	public getLiquidityDetailById = async (
		liquidityId: string,
	): Promise<LiquidityDetailInfoResponse> => {
		return {
			token_pair_logo: [""],
			token_pair_name: [""],
			fee: "0.01%",
			label: "Incentivized",
			liquidity: {
				changed_of_24h: 1,
				usd_value: 1,
			},
			volume: {
				changed_of_24h: 1,
				usd_value: 1,
			},
			apr: {
				fees: 1,
				fiat_value: 1,
				rewards: 1,
			},
		};
	};

	public getLiquiditiesByAddress = async (
		address: string,
	): Promise<LiquidityListResponse> => {
		return {
			liquidities: [],
		};
	};

	public addLiquidity = async (
		request: AddLiquidityRequest,
	): Promise<AddLiquidityResponse> => {
		return {
			tx_hash: generateTxHash(),
		};
	};

	public removeLiquidities = async (
		request: RemoveLiquidityRequest,
	): Promise<RemoveLiquidityResponse> => {
		return {};
	};

	public getLiquidityRewardBy = async (
		poolId: string,
		address: string,
	): Promise<LiquidityRewardResponse> => {
		return {};
	};

	public claimReward = async (
		request: ClaimRewardReqeust,
	): Promise<ClaimRewardResponse> => {
		return {
			tx_hash: generateTxHash(),
		};
	};
}
