import BigNumber from "bignumber.js";
import {
  getUsdBalance,
  mathSybmolAbsFormat,
  rawToDisplayAmount,
  toMillionFormat,
  toNumberFormat,
  toUnitFormat,
} from "./number-utils";

describe("bignumber.js convert to format string", () => {
  test("123123123.123123123 to 123,123,123.123123123", () => {
    const bigNumber = BigNumber("123123123.123123123");

    expect(toNumberFormat(bigNumber)).toBe("123,123,123.123123123");
  });

  test("decimal places is 3, 123123123.123123123 to 123,123,123.123", () => {
    const bigNumber = BigNumber("123123123.123123123");

    expect(toNumberFormat(bigNumber, 3)).toBe("123,123,123.123");
  });
});

describe("mathSybmolAbsFormat", () => {
  test("Truncates the number 12345.6789 to 2 decimal places and returns it with a percent notation.", () => {
    const num = 12345.6789;
    expect(mathSybmolAbsFormat(num, 2, false, true).value).toBe("+12,345.67%");
  });

  test("Truncate the number -12345.6789 to 2 decimal places and return it with a dollar sign", () => {
    const num = -12345.6789;
    expect(mathSybmolAbsFormat(num, 2, true, false).value).toBe("-$12,345.67");
  });
});

describe("The toUnitFormat function returns a value represented in numeric units and up to two decimal places.", () => {
  test("12345.6789 to $12.35K", () => {
    const num = 12345.6789;
    expect(toUnitFormat(num, true, true)).toBe("$12.35K");
  });

  test("-12345.6789 to -12.35K", () => {
    const num = -12345.6789;
    expect(toUnitFormat(num, false, true)).toBe("-12.35K");
  });
});

describe("toMillionFormat returns Million or FormatNumber", () => {
  test("1000 to 1,000", () => {
    const num = 1000;
    expect(toMillionFormat(num)).toBe("1,000.00");
  });

  test("1000000 to 1.00m", () => {
    const num = 1000000;
    expect(toMillionFormat(num)).toBe("1.00m");
  });

  test("1234567 to 1.23m", () => {
    const num = 1234567;
    expect(toMillionFormat(num)).toBe("1.23m");
  });

  test("\"\" to null", () => {
    const num = "";
    expect(toMillionFormat(num)).toBe(null);
  });
});

describe("rawToDisplayAmount", () => {
  it("should convert raw amount with decimals correctly", () => {
    expect(rawToDisplayAmount("1000000", 6)).toBe(1);
    expect(rawToDisplayAmount("1500000", 6)).toBe(1.5);
    expect(rawToDisplayAmount("100", 6)).toBe(0.0001);
    expect(rawToDisplayAmount("1234567", 6)).toBe(1.234567);
  });

  it("should handle different decimal places", () => {
    expect(rawToDisplayAmount("1000", 3)).toBe(1);
    expect(rawToDisplayAmount("1000000000", 9)).toBe(1);
    expect(rawToDisplayAmount("1000000000000000000", 18)).toBe(1);
  });

  it("should handle string and number inputs", () => {
    expect(rawToDisplayAmount("1000000", 6)).toBe(1);
    expect(rawToDisplayAmount(1000000, 6)).toBe(1);
  });

  it("should handle zero values", () => {
    expect(rawToDisplayAmount("0", 6)).toBe(0);
    expect(rawToDisplayAmount(0, 6)).toBe(0);
  });

  it("should handle null and undefined values", () => {
    expect(rawToDisplayAmount(null, 6)).toBe(0);
    expect(rawToDisplayAmount(undefined, 6)).toBe(0);
  });

  it("should handle very small amounts", () => {
    expect(rawToDisplayAmount("1", 6)).toBe(0.000001);
    expect(rawToDisplayAmount("10", 6)).toBe(0.00001);
  });

  it("should handle very large amounts", () => {
    expect(rawToDisplayAmount("1000000000000", 6)).toBe(1000000);
  });
});

describe("getUsdBalance", () => {
  it("converts a raw token amount to its USD balance", () => {
    expect(getUsdBalance("1000000", "1.13", 6).toString()).toBe("1.13");
  });

  it("preserves raw amount precision without converting through a JavaScript number", () => {
    expect(getUsdBalance("9007199254740993", "1", 0).toString()).toBe("9007199254740993");
  });

  it("returns zero for missing or invalid inputs", () => {
    expect(getUsdBalance(null, "1", 6).isZero()).toBe(true);
    expect(getUsdBalance("1", "not-a-price", 6).isZero()).toBe(true);
    expect(getUsdBalance("1", "1", -1).isZero()).toBe(true);
  });
});
