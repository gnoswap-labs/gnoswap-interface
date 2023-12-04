import { PoolRepository, PoolRepositoryMock } from ".";

let poolRepository: PoolRepository;

beforeEach(() => {
  poolRepository = new PoolRepositoryMock();
});

describe("getPools", () => {
  it("success", async () => {
    const pools = await poolRepository.getPools();

    expect(pools).not.toBeNull();
  });
});

describe("getPoolDetail", () => {
  it("success", async () => {
    const pools = await poolRepository.getPoolDetailByPoolId("");

    expect(pools).not.toBeNull();
  });
});
