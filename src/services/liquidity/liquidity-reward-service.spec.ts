import { LiquidityService } from "./liquidity-service";
import { LiquidityRepositoryMock } from "@/repositories/liquidity";
import { LiquidityError } from "@/common/errors/liquidity";
import BigNumber from "bignumber.js";
import { LiquidityRewardService } from "./liquidity-reward-service";

const liquidityRepository = new LiquidityRepositoryMock();
const liquidityRewardService = new LiquidityRewardService(liquidityRepository);

beforeEach(() => {
	jest.clearAllMocks();
});

describe("getLiquidityReward", () => {
	it("response is success", async () => {
		const spyFnGetLiquidityRewardByAddressAndPoolId = jest.spyOn(
			liquidityRepository,
			"getLiquidityRewardByAddressAndPoolId",
		);
		// given
		const address = "ADDRESS";
		const poolId = "1";

		// when
		const response = await liquidityRewardService.getLiquidityReward(
			address,
			poolId,
		);

		// then
		expect(spyFnGetLiquidityRewardByAddressAndPoolId).toBeCalledTimes(1);
		expect(response).not.toBeNull();
		expect(typeof response?.liquidityId).toBe("string");
		expect(typeof response?.isClaim).toBe("boolean");
		expect(typeof response?.totalBalance).toBe("object");
		expect(typeof response?.dailyEarning).toBe("object");
		expect(typeof response?.reward).toBe("object");
	});

	it("response is null", async () => {
		liquidityRepository.getLiquidityRewardByAddressAndPoolId = jest
			.fn()
			.mockResolvedValue(null);
		// given
		const address = "ADDRESS";
		const poolId = "1";

		// when
		const response = await liquidityRewardService.getLiquidityReward(
			address,
			poolId,
		);

		// then
		expect(
			liquidityRepository.getLiquidityRewardByAddressAndPoolId,
		).toBeCalledTimes(1);
		expect(response).toBeNull();
	});

	it("resposne is error", async () => {
		liquidityRepository.getLiquidityRewardByAddressAndPoolId = jest
			.fn()
			.mockRejectedValue(new Error("Unknown Error"));
		// given
		const address = "ADDRESS";
		const poolId = "1";

		// when
		const response = await liquidityRewardService.getLiquidityReward(
			address,
			poolId,
		);

		// then
		expect(
			liquidityRepository.getLiquidityRewardByAddressAndPoolId,
		).toBeCalledTimes(1);
		expect(response).toBeNull();
	});
});

describe("claimReward", () => {
	it("response is success", async () => {
		const spyFnClaimRewardByPoolId = jest.spyOn(
			liquidityRepository,
			"claimRewardByPoolId",
		);
		// given
		const poolId = "1";

		// when
		const response = await liquidityRewardService.claimReward(poolId);

		// then
		expect(spyFnClaimRewardByPoolId).toBeCalledTimes(1);
		expect(response).not.toBeNull();
		expect(response?.txHash).not.toBeNull();
	});

	it("repository response is null", async () => {
		// occur error in repository
		liquidityRepository.claimRewardByPoolId = jest.fn().mockResolvedValue(null);

		// given
		const poolId = "1";

		// when
		const response = await liquidityRewardService.claimReward(poolId);

		// then
		expect(response).toBeNull();
	});

	it("repository response is error", async () => {
		// occur error in repository
		liquidityRepository.claimRewardByPoolId = jest
			.fn()
			.mockRejectedValue(new LiquidityError("NOT_FOUND_LIQUIDITY"));

		// given
		const poolId = "1";

		// when
		const response = await liquidityRewardService.claimReward(poolId);

		// then
		expect(response).toBeNull();
	});
});

export {};
