import BigNumber from "bignumber.js";
import {
  mathSybmolAbsFormat,
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
    expect(mathSybmolAbsFormat(num, 2, false, true).value).toBe("+12,345.68%");
  });

  test("Truncate the number -12345.6789 to 2 decimal places and return it with a dollar sign", () => {
    const num = -12345.6789;
    expect(mathSybmolAbsFormat(num, 2, true, false).value).toBe("-$12,345.68");
  });
});

describe("The toUnitFormat function returns a value represented in numeric units and up to two decimal places.", () => {
  // test("12345.6789 to $12.35K", () => {
  //   const num = 12345.6789;
  //   expect(toUnitFormat(num, true, true)).toBe("$12.35K");
  // });

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

  test('"" to null', () => {
    const num = "";
    expect(toMillionFormat(num)).toBe(null);
  });
});
