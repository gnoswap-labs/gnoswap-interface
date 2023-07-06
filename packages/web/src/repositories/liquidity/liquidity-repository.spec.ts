import { LiquidityError } from "@common/errors/liquidity";
import { LiquidityRepository } from "./liquidity-repository";
import { LiquidityRepositoryMock } from "./liquidity-repository-mock";

let liquidityRepository: LiquidityRepository;

beforeEach(() => {
  liquidityRepository = new LiquidityRepositoryMock();
});

describe("getLiquidityById", () => {
  it("success", async () => {
    const liquidityId = "L1";

    const liquidity = await liquidityRepository.getLiquidityById(liquidityId);

    expect(liquidity).toBeTruthy();
  });

  it("error is not found liquidity", async () => {
    const liquidityId = "L0";
    let error: Error | undefined;

    try {
      await liquidityRepository.getLiquidityById(liquidityId);
    } catch (e) {
      if (e instanceof Error) {
        error = e;
      }
    }

    console.log(error?.message);
    expect(error).toBeInstanceOf(LiquidityError);
    expect(error?.message).toBe("Not found liquidity");
  });
});
