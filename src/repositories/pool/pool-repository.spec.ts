import { PoolListInfoResponse, PoolRepository, MockPoolRepository } from ".";

let poolRepository: PoolRepository;

beforeEach(() => {
	poolRepository = new MockPoolRepository();
});

describe("pool repository", () => {
	it("get pools", async () => {
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
		expect(typeof pool.volumn_24h).toBe("number");
		expect(typeof pool.rewards[0].amount.value).toBe("number");
		expect(typeof pool.liquidity.token0.amount.value).toBe("number");
		expect(typeof pool.liquidity.token1.amount.value).toBe("number");
	});
});

export {};
