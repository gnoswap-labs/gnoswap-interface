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
});
