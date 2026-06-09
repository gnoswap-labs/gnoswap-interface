import { GNOT_TOKEN } from "@common/values/token-constant";
import { TokenModel } from "@models/token/token-model";
import {
  formatDisplayTokenSymbol,
  formatTokenBalanceDisplay,
  formatTokenModelPath,
  formatTokenPath,
  isNativeTokenPath,
  isAmountLessThanTokenMinimum,
  makeDisplayTokenAmount,
  makeRawTokenAmount,
} from "./token-utils";

const DEFAULT_TOKEN: TokenModel = {
  decimals: 6,
  path: "",
  tokenId: "",
  address: "",
  type: "GRC20",
  priceID: "",
  chainId: "",
  name: "",
  symbol: "",
  displaySymbol: "",
  logoURI: "",
  createdAt: "",
};

describe("format display token symbol", () => {
  it("should keep token symbols with 9 or fewer characters", () => {
    expect(formatDisplayTokenSymbol("GNOT")).toBe("GNOT");
    expect(formatDisplayTokenSymbol("123456789")).toBe("123456789");
  });

  it("should shorten token symbols longer than 9 characters", () => {
    expect(formatDisplayTokenSymbol("1234567890")).toBe("123456789...");
    expect(formatDisplayTokenSymbol("ibc/488D610A5FB7878660703092A35BC4E7D0C88E2EA71174337AA317A22C05177F")).toBe(
      "ibc/488D6...",
    );
  });
});

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

  test("1.23 to 123000000 with 8 decimals", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 8,
    };
    const result = makeRawTokenAmount(token, 1.23);
    expect(result).toBe("123000000");
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

  test("123000000 to 1.23 with 8 decimals", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 8,
    };
    const result = makeDisplayTokenAmount(token, "123000000");
    expect(result).toBe(1.23);
  });
});

describe("is amount less than token minimum", () => {
  test("uses 6-decimal minimum display amount", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };

    expect(isAmountLessThanTokenMinimum(token, "0.0000009")).toBe(true);
    expect(isAmountLessThanTokenMinimum(token, "0.000001")).toBe(false);
  });

  test("uses 8-decimal minimum display amount", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 8,
    };

    expect(isAmountLessThanTokenMinimum(token, "0.000000009")).toBe(true);
    expect(isAmountLessThanTokenMinimum(token, "0.00000001")).toBe(false);
  });

  test("uses integer minimum for 0-decimal tokens", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 0,
    };

    expect(isAmountLessThanTokenMinimum(token, "0.9")).toBe(true);
    expect(isAmountLessThanTokenMinimum(token, "1")).toBe(false);
  });

  test("does not treat empty, zero, or invalid input as below minimum", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };

    expect(isAmountLessThanTokenMinimum(token, "")).toBe(false);
    expect(isAmountLessThanTokenMinimum(token, "0")).toBe(false);
    expect(isAmountLessThanTokenMinimum(token, "abc")).toBe(false);
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

describe("format token path", () => {
  it("should keep non-native token paths unshortened after removing gno.land prefix", () => {
    expect(formatTokenPath("gno.land/r/gnoswap/gns", false)).toBe("r/gnoswap/gns");
    expect(formatTokenPath("ibc/488D610A5FB7878660703092A35BC4E7D0C88E2EA71174337AA317A22C05177F", false)).toBe(
      "ibc/488D610A5FB7878660703092A35BC4E7D0C88E2EA71174337AA317A22C05177F",
    );
  });

  it("should keep native token path display unchanged", () => {
    expect(formatTokenPath(GNOT_TOKEN.path, true)).toBe("Native Coin");
  });

  it("should keep token model paths unshortened", () => {
    expect(
      formatTokenModelPath({
        ...DEFAULT_TOKEN,
        path: "ibc/488D610A5FB7878660703092A35BC4E7D0C88E2EA71174337AA317A22C05177F",
      }),
    ).toBe("ibc/488D610A5FB7878660703092A35BC4E7D0C88E2EA71174337AA317A22C05177F");
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
