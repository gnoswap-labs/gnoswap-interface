import { PoolListInfoResponse, PoolRepository, PoolRepositoryMock } from ".";

let poolRepository: PoolRepository;

beforeEach(() => {
	poolRepository = new PoolRepositoryMock();
});

describe("getPoolById", () => {
	it("success", async () => {
		const poolId = "P1";

		const response = await poolRepository.getPoolById(poolId);

		expect(response).toBeTruthy();
		expect(response).toHaveProperty("pool_id");
		expect(response).toHaveProperty("incentivized_type");
		expect(response).toHaveProperty("fee_rate");
		expect(response).toHaveProperty("liquidity");
		expect(response).toHaveProperty("rewards");
		expect(response.pool_id).toBeTruthy();
		expect(response.incentivized_type).toBeTruthy();
		expect(response.fee_rate).toBeTruthy();
		expect(response.liquidity).toBeTruthy();
		expect(response.rewards).toBeTruthy();
	});

	it("not found error when missing poolId", async () => {
		const poolId = "P6";
		let error = null;

		try {
			await poolRepository.getPoolById(poolId);
		} catch (e) {
			error = e;
		}

		expect(error).toBeTruthy();
	});
});

describe("getPools", () => {
	it("success", async () => {
		const response = await poolRepository.getPools();
		const pool = response?.pools[0];

		expect(response).toHaveProperty("total");
		expect(response).toHaveProperty("hits");
		expect(response).toHaveProperty("pools");
		expect(typeof response.hits).toBe("number");
		expect(typeof response.total).toBe("number");
		expect(response.pools).not.toBeNull();
		expect(response.pools).toBeInstanceOf(Array<PoolListInfoResponse>);
		expect(typeof pool.pool_id).toBe("string");
		expect(typeof pool.apr).toBe("number");
		expect(typeof pool.fee_rate).toBe("number");
		expect(typeof pool.fees_24h).toBe("number");
		expect(typeof pool.incentivized_type).toBe("string");
		expect(typeof pool.volume_24h).toBe("number");
		expect(typeof pool.rewards[0].amount.value).toBe("number");
		expect(typeof pool.liquidity.token0.amount.value).toBe("number");
		expect(typeof pool.liquidity.token1.amount.value).toBe("number");
	});
});

describe("getPoolsByAddress", () => {
	it("success", async () => {
		const address = "User";

		const response = await poolRepository.getPoolsByAddress(address);
		const pool = response?.pools[0];

		expect(response).toHaveProperty("total");
		expect(response).toHaveProperty("hits");
		expect(response).toHaveProperty("pools");
		expect(typeof response.hits).toBe("number");
		expect(typeof response.total).toBe("number");
		expect(response.pools).not.toBeNull();
		expect(response.pools).toBeInstanceOf(Array<PoolListInfoResponse>);
		expect(typeof pool.pool_id).toBe("string");
		expect(typeof pool.apr).toBe("number");
		expect(typeof pool.fee_rate).toBe("number");
		expect(typeof pool.fees_24h).toBe("number");
		expect(typeof pool.incentivized_type).toBe("string");
		expect(typeof pool.volume_24h).toBe("number");
		expect(typeof pool.rewards[0].amount.value).toBe("number");
		expect(typeof pool.liquidity.token0.amount.value).toBe("number");
		expect(typeof pool.liquidity.token1.amount.value).toBe("number");
	});
});
