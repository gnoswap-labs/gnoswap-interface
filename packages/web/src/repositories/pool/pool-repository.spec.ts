import { PoolRepository, PoolRepositoryMock } from ".";

let poolRepository: PoolRepository;

beforeEach(() => {
  poolRepository = new PoolRepositoryMock();
});

describe("getPools", () => {
  it("success", async () => {
    const response = await poolRepository.getPools();

    expect(response.pools).not.toBeNull();
  });
});

describe("getPoolDetail", () => {
  it("success", async () => {
    const response = await poolRepository.getPoolDetailByPoolId("");

    expect(response.pool).not.toBeNull();
  });
});
