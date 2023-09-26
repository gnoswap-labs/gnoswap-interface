import { PoolRepository, PoolRepositoryMock } from ".";

let poolRepository: PoolRepository;

beforeEach(() => {
  poolRepository = new PoolRepositoryMock();
});

describe("getPools", () => {
  it("success", async () => {
    const response = await poolRepository.getPools();

    expect(response).toHaveProperty("message");
    expect(response).toHaveProperty("count");
    expect(response).toHaveProperty("meta");
    expect(response).toHaveProperty("pools");
    expect(typeof response.count).toBe("number");
    expect(response.pools).not.toBeNull();
  });
});

describe("getPoolDetail", () => {
  it("success", async () => {
    const response = await poolRepository.getPoolDetailByPoolId("");

    expect(response).toHaveProperty("message");
    expect(response).toHaveProperty("count");
    expect(response).toHaveProperty("meta");
    expect(response).toHaveProperty("pool");
    expect(response.pool).not.toBeNull();
  });
});
