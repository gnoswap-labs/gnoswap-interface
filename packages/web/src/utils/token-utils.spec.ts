import { GNOT_TOKEN } from "@common/values/token-constant";
import { TokenModel } from "@models/token/token-model";
import {
  formatTokenBalanceDisplay,
  isNativeTokenPath,
  makeDisplayTokenAmount,
  makeRawTokenAmount,
} from "./token-utils";

const DEFAULT_TOKEN: TokenModel = {
  decimals: 6,
  path: "",
  address: "",
  type: "GRC20",
  priceID: "",
  chainId: "",
  name: "",
  symbol: "",
  logoURI: "",
  createdAt: "",
};

describe("make token raw price", () => {
  test("1 to 1000000", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = 1;
    const result = makeRawTokenAmount(token, amount);
    expect(result).toBe("1000000");
  });

  test("0.123456 to 123456", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = 0.123456;
    const result = makeRawTokenAmount(token, amount);
    expect(result).toBe("123456");
  });

  test("0.123456789 to 123456", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = 0.123456789;
    const result = makeRawTokenAmount(token, amount);
    expect(result).toBe("123456");
  });
});

describe("make token display price", () => {
  test("1000000 to 1", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = 1000000;
    const result = makeDisplayTokenAmount(token, amount);
    expect(result).toBe(1);
  });

  test("1 to 0.000001", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = 1;
    const result = makeDisplayTokenAmount(token, amount);
    expect(result).toBe(0.000001);
  });

  test("'1' to 0.000001", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = "1";
    const result = makeDisplayTokenAmount(token, amount);
    expect(result).toBe(0.000001);
  });
});

describe("format token balance display", () => {
  describe("Behavior based on wallet connection status", () => {
    test("Should return “-” when the wallet is not connected", () => {
      expect(formatTokenBalanceDisplay("1000", false)).toBe("-");
    });

    test("Must return a formatted value when the wallet is connected", () => {
      expect(formatTokenBalanceDisplay("1000", true)).toBe("1,000");
    });
  });

  describe("Processing balance input values", () => {
    test("should return '-' when balance is undefined", () => {
      // @ts-expect-error: testing undefined case
      expect(formatTokenBalanceDisplay(undefined, true)).toBe("-");
    });

    test("should return '-' when balance is null", () => {
      // @ts-expect-error: testing null case
      expect(formatTokenBalanceDisplay(null, true)).toBe("-");
    });

    test("should return '-' when balance is empty", () => {
      expect(formatTokenBalanceDisplay("", true)).toBe("-");
    });

    test("should handle invalid number strings", () => {
      expect(formatTokenBalanceDisplay("abc", true)).toBe("-");
    });

    test("should handle multiple decimal points (invalid input)", () => {
      expect(formatTokenBalanceDisplay("1000.12.34", true)).toBe("-");
    });

    test("Plain numeric strings must be formatted correctly", () => {
      expect(formatTokenBalanceDisplay("1000", true)).toBe("1,000");
    });

    test("Strings containing commas should be handled correctly", () => {
      expect(formatTokenBalanceDisplay("1,000", true)).toBe("1,000");
    });

    test("formatTokenBalanceDisplay decimal point handling", () => {
      expect(formatTokenBalanceDisplay("1,000.123456", true)).toBe("1,000.12");
    });

    test("should handle numbers with leading zeros", () => {
      expect(formatTokenBalanceDisplay("000123", true)).toBe("123");
      expect(formatTokenBalanceDisplay("00.123", true)).toBe("0.12");
    });

    test("should handle whitespace in input", () => {
      expect(formatTokenBalanceDisplay(" 1000 ", true)).toBe("1,000");
      expect(formatTokenBalanceDisplay("\t1000\n", true)).toBe("1,000");
    });

    test("should handle extreme decimal precision", () => {
      expect(formatTokenBalanceDisplay("1.999999999999999", true)).toBe("1.99");
      expect(formatTokenBalanceDisplay("0.999999999999999", true)).toBe("0.99");
    });

    test("should handle very large numbers", () => {
      expect(formatTokenBalanceDisplay("1000000000.12", true)).toBe("1,000,000,000.12");
      expect(formatTokenBalanceDisplay("999999999999.99", true)).toBe("999,999,999,999.99");
      expect(formatTokenBalanceDisplay("999999999999.999999", true)).toBe("999,999,999,999.99");
    });
  });
});

describe("isNativeTokenPath", () => {
  it("should return true for native token (GNOT)", () => {
    expect(isNativeTokenPath(GNOT_TOKEN.path)).toBe(true);
  });

  it("should return false for non-native tokens", () => {
    const token = {
      ...DEFAULT_TOKEN,
      path: "gno.land/r/demo/token",
    };
    expect(isNativeTokenPath(token.path)).toBe(false);
  });

  it("should return false for empty path", () => {
    const token = {
      ...DEFAULT_TOKEN,
      path: "",
    };
    expect(isNativeTokenPath(token.path)).toBe(false);
  });

  it("should return false for similar but not identical path", () => {
    const token = {
      ...DEFAULT_TOKEN,
      path: GNOT_TOKEN.path + "/extra",
    };
    expect(isNativeTokenPath(token.path)).toBe(false);
  });

  it("should return false for path null", () => {
    expect(isNativeTokenPath("")).toBe(false);
  });
});
