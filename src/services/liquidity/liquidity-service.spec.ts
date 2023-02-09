import { LiquidityService } from "./liquidity-service";
import { LiquidityRepositoryMock } from "@/repositories/liquidity";
import { LiquidityError } from "@/common/errors/liquidity";
import BigNumber from "bignumber.js";

const liquidityRepository = new LiquidityRepositoryMock();
const liquidityService = new LiquidityService(liquidityRepository);

beforeEach(() => {
	jest.clearAllMocks();
});

describe("getLiquidity", () => {
	const spyFnGetLiquidity = jest.spyOn(liquidityRepository, "getLiquidityById");

	it("success", async () => {
		// given
		const liquidityId = "L1";

		// when
		const liquidity = await liquidityService.getLiquidity(liquidityId);

		// then
		expect(spyFnGetLiquidity).toBeCalledTimes(1);
		expect(liquidity).not.toBeNull();
		expect(typeof liquidity?.liquidityId).toBe("string");
		expect(typeof liquidity?.poolId).toBe("string");
		expect(typeof liquidity?.stakeType).toBe("string");
		expect(typeof liquidity?.inRange).toBe("boolean");
		expect(typeof liquidity?.feeRate).toBe("number");
		expect(typeof liquidity?.maxRate).toBe("number");
		expect(typeof liquidity?.minRate).toBe("number");
		expect(typeof liquidity?.liquidity).not.toBeNull();
		expect(typeof liquidity?.apr).not.toBeNull();
		expect(typeof liquidity?.reward).not.toBeNull();
	});

	it("does not exists when liquidity id is 0", async () => {
		// given
		const liquidityId = "0";

		// when
		const liquidity = await liquidityService.getLiquidity(liquidityId);

		// then
		expect(spyFnGetLiquidity).toBeCalledTimes(1);
		expect(liquidity).toBeNull();
	});
});

describe("getLiquiditiesByAddressAndPoolId", () => {
	const getLiquiditiesByAddressAndPoolId = jest.spyOn(
		liquidityRepository,
		"getLiquiditiesByAddressAndPoolId",
	);

	it("success", async () => {
		// given
		const address = "G1";
		const poolId = "P1";

		// when
		const response = await liquidityService.getLiquiditiesByAddressAndPoolId(
			address,
			poolId,
		);

		// then
		expect(getLiquiditiesByAddressAndPoolId).toBeCalledTimes(1);
		expect(response).not.toBeNull();
		expect(response?.hits).not.toBeNull();
		expect(response?.total).not.toBeNull();
		expect(response?.liquidities).not.toBeNull();
		expect(response?.liquidities.length).toBeGreaterThan(0);
	});

	it("occurs error result is null", async () => {
		// occur error in repository
		liquidityRepository.getLiquiditiesByAddress = jest
			.fn()
			.mockRejectedValue(new LiquidityError("NOT_FOUND_LIQUIDITY"));

		// given
		const address = "abcd";
		const poolId = "1";

		// when
		const response = await liquidityService.getLiquiditiesByAddressAndPoolId(
			address,
			poolId,
		);

		// then
		expect(response).toBeTruthy();
		expect(response?.hits).toBe(0);
		expect(response?.total).toBe(0);
		expect(response?.liquidities).toHaveLength(0);
	});
});

describe("addLiquidity", () => {
	it("add liquidity resposne is success", async () => {
		const spyFnAddLiquidity = jest.spyOn(liquidityRepository, "addLiquidityBy");
		// given
		const poolId = "1";
		const liquidity = {
			token0: {
				tokenId: "1",
				symbol: "GNOLAND",
				name: "GNOLAND",
				amount: {
					value: BigNumber(100),
					denom: "ugnot",
				},
			},
			token1: {
				tokenId: "2",
				symbol: "GNOSWAP",
				name: "GNOSWAP",
				amount: {
					value: BigNumber(1000),
					denom: "ugnosh",
				},
			},
		};
		const options = {
			rangeType: "ACTIVE" as "ACTIVE" | "PASSIVE" | "CUSTOM",
			feeRate: 0.1,
			minRate: 0.9,
			maxRate: 1.1,
		};

		// when
		const response = await liquidityService.addLiquidity(
			poolId,
			liquidity,
			options,
		);

		// then
		expect(spyFnAddLiquidity).toBeCalledTimes(1);
		expect(response).toBeTruthy();
		expect(response?.txHash).toBeTruthy();
	});

	it("add liquidity resposne is timeout error", async () => {
		liquidityRepository.addLiquidityBy = jest
			.fn()
			.mockRejectedValue(new Error("Adena timeout"));
		// given
		const poolId = "1";
		const liquidity = {
			token0: {
				tokenId: "1",
				symbol: "GNOLAND",
				name: "GNOLAND",
				amount: {
					value: BigNumber(100),
					denom: "ugnot",
				},
			},
			token1: {
				tokenId: "2",
				symbol: "GNOSWAP",
				name: "GNOSWAP",
				amount: {
					value: BigNumber(1000),
					denom: "ugnosh",
				},
			},
		};
		const options = {
			rangeType: "ACTIVE" as "ACTIVE" | "PASSIVE" | "CUSTOM",
			feeRate: 0.1,
			minRate: 0.9,
			maxRate: 1.1,
		};

		// when
		const response = await liquidityService.addLiquidity(
			poolId,
			liquidity,
			options,
		);

		// then
		expect(response).toBeNull();
	});
});

describe("removeLiquidity", () => {
	it("remove liquidity response is success", async () => {
		const spyFnRemoveLiquidity = jest.spyOn(
			liquidityRepository,
			"removeLiquiditiesBy",
		);
		// given
		const liquidityIds = ["1", "2", "3"];

		// when
		const response = await liquidityService.removeLiquidities(liquidityIds);

		// then
		expect(spyFnRemoveLiquidity).toBeCalledTimes(1);
		expect(response).toBeTruthy();
		expect(response?.txHash).toBeTruthy();
	});

	it("remove liquidity response is fail", async () => {
		liquidityRepository.removeLiquiditiesBy = jest.fn().mockResolvedValue(null);
		// given
		const liquidityIds = ["1", "2", "3"];

		// when
		const response = await liquidityService.removeLiquidities(liquidityIds);

		// then
		expect(liquidityRepository.removeLiquiditiesBy).toBeCalledTimes(1);
		expect(response).toBeFalsy();
	});

	it("remove liquidity response is timeout error", async () => {
		liquidityRepository.removeLiquiditiesBy = jest
			.fn()
			.mockRejectedValue(new Error("Adena timeout"));
		// given
		const liquidityIds = ["1", "2", "3"];

		// when
		const response = await liquidityService.removeLiquidities(liquidityIds);

		// then
		expect(liquidityRepository.removeLiquiditiesBy).toBeCalledTimes(1);
		expect(response).toBeFalsy();
	});
});

export {};
