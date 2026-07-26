import * as swapUtils from "./swap-utils";
import { getRepositionAmountsByPriceRange } from "./reposition-utils";

jest.mock("./swap-utils", () => {
  const actual = jest.requireActual("./swap-utils");
  return {
    ...actual,
    getDepositAmountsByAmountA: jest.fn().mockReturnValue({ amountA: 0, amountB: 0 }),
    getDepositAmountsByAmountB: jest.fn().mockReturnValue({ amountA: 0, amountB: 0 }),
  };
});

describe("getRepositionAmountsByPriceRange", () => {
  const mockGetDepositAmountsByAmountA = swapUtils.getDepositAmountsByAmountA as jest.Mock;
  const mockGetDepositAmountsByAmountB = swapUtils.getDepositAmountsByAmountB as jest.Mock;

  beforeEach(() => {
    mockGetDepositAmountsByAmountA.mockReset().mockReturnValue({ amountA: 0, amountB: 0 });
    mockGetDepositAmountsByAmountB.mockReset().mockReturnValue({ amountA: 0, amountB: 0 });
  });

  test("returns { amountA: 0, amountB: 0 } when deposit ratio is NaN (both amounts zero)", () => {
    const result = getRepositionAmountsByPriceRange(
      1,
      79228162514264337593543950336n,
      0.5,
      2.0,
      0.5,
      2.0,
      "1000",
      "1000",
    );

    expect(Number.isNaN(result.amountA)).toBe(false);
    expect(Number.isNaN(result.amountB)).toBe(false);
    expect(result).toEqual({ amountA: 0, amountB: 0 });
  });

  test("preserves total when origin position is 100% tokenB and target is 50/50", () => {
    mockGetDepositAmountsByAmountA
      .mockImplementationOnce(() => ({ amountA: 0, amountB: 100 }))
      .mockImplementationOnce(() => ({ amountA: 100, amountB: 100 }));

    const result = getRepositionAmountsByPriceRange(
      1,
      79228162514264337593543950336n,
      0.5,
      2.0,
      0.5,
      2.0,
      "0",
      "1000",
    );

    expect(result).toEqual({ amountA: 500, amountB: 500 });
  });

  test("preserves total when origin position is 100% tokenA and target is 50/50", () => {
    mockGetDepositAmountsByAmountA
      .mockImplementationOnce(() => ({ amountA: 100, amountB: 0 }))
      .mockImplementationOnce(() => ({ amountA: 100, amountB: 100 }));

    const result = getRepositionAmountsByPriceRange(
      1,
      79228162514264337593543950336n,
      0.5,
      2.0,
      0.5,
      2.0,
      "1000",
      "0",
    );

    expect(result).toEqual({ amountA: 500, amountB: 500 });
  });

  test("returns Infinity sentinel when one-sided origin requires only opposite token in new range", () => {
    mockGetDepositAmountsByAmountA
      .mockImplementationOnce(() => ({ amountA: 0, amountB: 100 }))
      .mockImplementationOnce(() => ({ amountA: 100, amountB: 0 }));

    const result = getRepositionAmountsByPriceRange(
      1,
      79228162514264337593543950336n,
      0.5,
      2.0,
      0.5,
      2.0,
      "0",
      "1000",
    );

    expect(result.amountA).toBe(Number.POSITIVE_INFINITY);
    expect(result.amountB).toBe(0);
  });
});
