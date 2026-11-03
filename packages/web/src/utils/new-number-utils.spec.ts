import BigNumber from "bignumber.js";
import { formatPoolPairAmount } from "./new-number-utils";

describe("formatPoolPairAmount", () => {
  it.each([
    ["1.000000123", 9, "1.000000123"],
    ["1.000000000000000123", 18, "1.000000000000000123"],
    ["1.000000123999", 9, "1.000000123"],
    ["1.123450000", 9, "1.12345"],
    ["1.000000000", 9, "1"],
    ["1000", 9, "1,000"],
    ["1,000.000000123", 9, "1,000.000000123"],
    ["1.123456789", 6, "1.123456"],
    ["0", 9, "0"],
  ])("formats %s at %i decimals as %s without losing significant digits", (amount, decimals, expected) => {
    expect(formatPoolPairAmount(amount, { decimals, isKMB: false })).toBe(expected);
  });

  it("keeps arbitrary precision when no decimal limit is supplied", () => {
    expect(formatPoolPairAmount(new BigNumber("1.000000000000000123"), { isKMB: false })).toBe("1.000000000000000123");
  });

  it("preserves sub-unit amounts when minimum limiting is disabled", () => {
    expect(formatPoolPairAmount("0.000000123", { decimals: 9, isKMB: false, minLimit: null, hasMinLimit: false })).toBe(
      "0.000000123",
    );
  });

  it.each([
    ["0.009", {}, "<0.01"],
    ["0.0000000001", { decimals: 9, minLimit: null }, "<1e-9"],
    ["1234.56789", {}, "1.23K"],
    ["1234567.89", {}, "1.23M"],
    ["1234567890", {}, "1.23B"],
    [null, {}, "-"],
    [undefined, {}, "-"],
    ["invalid", {}, "-"],
  ])("preserves existing threshold, abbreviation, and missing-value behavior for %s", (amount, options, expected) => {
    expect(formatPoolPairAmount(amount, options)).toBe(expected);
  });
});
