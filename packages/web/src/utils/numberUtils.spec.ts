import BigNumber from "bignumber.js";
import {
  mathSybmolAbsFormat,
  toNumberFormat,
  toUnitFormat,
} from "./numberUtils";

describe("bignumber.js convert to format string", () => {
  test("123123123.123123123 to 123,123,123.123123123", async () => {
    const bigNumber = BigNumber("123123123.123123123");

    expect(toNumberFormat(bigNumber)).toBe("123,123,123.123123123");
  });

  test("decimal places is 3, 123123123.123123123 to 123,123,123.123", async () => {
    const bigNumber = BigNumber("123123123.123123123");

    expect(toNumberFormat(bigNumber, 3)).toBe("123,123,123.123");
  });
});

describe("mathSybmolAbsFormat", () => {
  test("Truncates the number 12345.6789 to 2 decimal places and returns it with a percent notation.", async () => {
    expect(mathSybmolAbsFormat(12345.6789, 2, false, true)).toBe("+12,345.68%");
  });

  test("Truncate the number -12345.6789 to 2 decimal places and return it with a dollar sign", async () => {
    expect(mathSybmolAbsFormat(-12345.6789, 2, true, false)).toBe(
      "-$12,345.68",
    );
  });
});

describe("The toUnitFormat function returns a value represented in numeric units and up to two decimal places.", () => {
  test("12345.6789 to $12.35K", async () => {
    expect(toUnitFormat(12345.6789, true)).toBe("$12.35K");
  });

  test("-12345.6789 to -12.35K", async () => {
    expect(toUnitFormat(-12345.6789, false)).toBe("-12.35K");
  });
});
