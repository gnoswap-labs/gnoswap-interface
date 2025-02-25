import { PoolRepository, PoolRepositoryMock } from ".";

let poolRepository: PoolRepository;

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

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
    const pools = await poolRepository.getPoolDetailByPoolPath("");

    expect(pools).not.toBeNull();
  });
});
