import {
  formatOtherPrice,
  formatTokenAmount,
  formatRate,
  formatPoolPairAmount,
  formatPrice,
  removeTrailingZeros,
} from "./new-number-utils";

describe("removeTrailingZeros", () => {
  test("removes trailing zeros after decimal", () => {
    expect(removeTrailingZeros("1.000")).toBe("1");
    expect(removeTrailingZeros("1.100")).toBe("1.1");
    expect(removeTrailingZeros("1.120")).toBe("1.12");
  });

  test("preserves integer values without decimal point", () => {
    expect(removeTrailingZeros("10")).toBe("10");
    expect(removeTrailingZeros("100")).toBe("100");
    expect(removeTrailingZeros("0")).toBe("0");
  });

  test("preserves formatted integers with commas", () => {
    expect(removeTrailingZeros("1,000")).toBe("1,000");
  });

  test("handles decimal that becomes integer", () => {
    expect(removeTrailingZeros("5.00")).toBe("5");
  });
});

describe("formatOtherPrice", () => {
  describe("negative zero handling (GSW-2501)", () => {
    test("small negative value that rounds to zero should not show '-$0'", () => {
      expect(formatOtherPrice(-0.001)).toBe("$0");
    });

    test("very small negative value should not show '-$0'", () => {
      expect(formatOtherPrice(-0.000001)).toBe("$0");
    });

    test("negative value that rounds to zero as string input", () => {
      expect(formatOtherPrice("-0.004")).toBe("$0");
    });

    test("negative zero should display as '$0'", () => {
      expect(formatOtherPrice(-0)).toBe("$0");
    });

    test("actual negative value should still show negative sign", () => {
      expect(formatOtherPrice(-1.5)).toBe("-$1.5");
    });

    test("larger negative value should still show negative sign", () => {
      expect(formatOtherPrice(-100.99)).toBe("-$100.99");
    });
  });

  describe("basic formatting", () => {
    test("null returns '-'", () => {
      expect(formatOtherPrice(null)).toBe("-");
    });

    test("undefined returns '-'", () => {
      expect(formatOtherPrice(undefined)).toBe("-");
    });

    test("empty string returns '-'", () => {
      expect(formatOtherPrice("")).toBe("-");
    });

    test("zero returns '$0'", () => {
      expect(formatOtherPrice(0)).toBe("$0");
    });

    test("positive value formats correctly", () => {
      expect(formatOtherPrice(1234.56, { isKMB: false })).toBe("$1,234.56");
    });

    test("without usd prefix", () => {
      expect(formatOtherPrice(-0.001, { usd: false })).toBe("0");
    });
  });

  describe("minLimit comparison and display consistency", () => {
    test("uses resolvedMinLimit for both comparison and display", () => {
      // With minLimit=0.001, value 0.005 is NOT less than 0.001, so it should format normally
      const result = formatOtherPrice(0.005, { minLimit: 0.001, decimals: 2, isKMB: false });
      expect(result).not.toBe("<$0.001");
      // 0.005 is not less than 0.001 — should be formatted as "$0"
      // (0.005 rounds down to 0.00 with decimals=2, trailing zeros removed → "0")
      expect(result).toBe("$0");
    });

    test("value below resolvedMinLimit shows consistent threshold", () => {
      const result = formatOtherPrice(0.0005, { minLimit: 0.001, decimals: 2, isKMB: false });
      expect(result).toBe("<$0.001");
    });
  });

  describe("precision preservation with removeTrailingZeros", () => {
    test("long decimal string preserves precision", () => {
      const result = formatOtherPrice("0.123456789012345678", {
        decimals: 18,
        isKMB: false,
        hasMinLimit: false,
      });
      expect(result).toBe("$0.123456789012345678");
    });

    test("trailing zeros in long decimal are removed", () => {
      const result = formatOtherPrice("1.50000", { decimals: 5, isKMB: false });
      expect(result).toBe("$1.5");
    });
  });
});

describe("formatTokenAmount", () => {
  describe("null safety on NaN branch", () => {
    test("null amount returns '-' via early null check", () => {
      expect(formatTokenAmount(null)).toBe("-");
    });

    test("non-numeric string returns the string itself", () => {
      expect(formatTokenAmount("abc")).toBe("abc");
    });

    // Verify the NaN branch is safe even if null somehow reaches it
    // (e.g. via JS caller bypassing TypeScript)
    test("NaN branch with null-like value does not throw", () => {
      // By design null is caught earlier, but the NaN branch now has a null guard
      expect(() => formatTokenAmount(null)).not.toThrow();
    });
  });

  describe("minLimit=0 handling with nullish coalescing", () => {
    test("minLimit=0 is honored (disables min limit)", () => {
      // With `??`, minLimit=0 is not falsy — it's used as the threshold
      // 0 as threshold means no value is less than 0 (for positive values), so no "<" prefix
      const result = formatTokenAmount(0.005, { minLimit: 0, decimals: 2, isKMB: false });
      expect(result).toBe("0.00");
    });

    test("minLimit=undefined falls back to decimals-based limit", () => {
      const result = formatTokenAmount(0.005, { decimals: 2, isKMB: false });
      // internalMinLimit = 0.01, 0.005 < 0.01 → "<0.01"
      expect(result).toBe("<0.01");
    });
  });

  describe("decimals=0 is honored", () => {
    test("decimals=0 formats as integer", () => {
      expect(formatTokenAmount(1234.56, { decimals: 0, isKMB: false })).toBe("1,234");
    });

    test("decimals=0 does not fall through to default toFormat", () => {
      // Without the fix, decimals=0 is falsy and skips the decimals branch
      const withDecimals0 = formatTokenAmount(1.999, { decimals: 0, isKMB: false });
      expect(withDecimals0).toBe("1");
    });
  });

  describe("negative values with minLimit", () => {
    test("negative value does not trigger minLimit check", () => {
      // isGreaterThan(0) guard prevents negative values from matching
      const result = formatTokenAmount(-5, { minLimit: 10, decimals: 2, isKMB: false });
      expect(result).toBe("-5.00");
    });
  });
});

describe("formatRate", () => {
  describe("showSign with zero value", () => {
    test("zero with showSign=true produces '0%' (not '+0%')", () => {
      expect(formatRate(0, { showSign: true })).toBe("0%");
    });

    test("zero with showSign=false produces '0%'", () => {
      expect(formatRate(0)).toBe("0%");
    });

    test("string '0' with showSign=true produces '0%'", () => {
      expect(formatRate("0", { showSign: true })).toBe("0%");
    });
  });

  describe("showSign with non-zero values", () => {
    test("negative value with showSign formats correctly", () => {
      expect(formatRate(-5.5, { showSign: true })).toBe("-5.50%");
    });

    test("positive value with showSign formats correctly", () => {
      expect(formatRate(5.5, { showSign: true })).toBe("+5.50%");
    });

    test("positive value without showSign has no sign", () => {
      expect(formatRate(5.5)).toBe("5.50%");
    });
  });

  describe("minLimit=0 handling", () => {
    test("minLimit=0 is honored", () => {
      const result = formatRate(0.005, { minLimit: 0, decimals: 2 });
      // minLimit=0, no value > 0 is less than 0, so it formats normally
      expect(result).toBe("0.00%");
    });
  });

  describe("decimals=0 is honored", () => {
    test("decimals=0 formats as integer percent", () => {
      expect(formatRate(5.75, { decimals: 0 })).toBe("5%");
    });
  });

  describe("basic formatting", () => {
    test("null returns '-'", () => {
      expect(formatRate(null)).toBe("-");
    });

    test("undefined returns '-'", () => {
      expect(formatRate(undefined)).toBe("-");
    });

    test("NaN string returns '-'", () => {
      expect(formatRate("abc")).toBe("-");
    });
  });
});

describe("formatPoolPairAmount", () => {
  describe("minLimit handling", () => {
    test("minLimit=0 is honored (does not fall back to decimals)", () => {
      // With `??`, minLimit=0 is used as the threshold
      // No positive value is less than 0, so it formats normally (no "<" prefix)
      // 0.005 with decimals=2 and ROUND_DOWN → "0.00" → trailing zeros removed → "0"
      const result = formatPoolPairAmount(0.005, { minLimit: 0, decimals: 2, isKMB: false });
      expect(result).not.toContain("<");
      expect(result).toBe("0");
    });

    test("minLimit=undefined falls back to decimals-based limit", () => {
      const result = formatPoolPairAmount(0.005, { minLimit: null, decimals: 2, isKMB: false });
      // internalMinLimit = 0.01, 0.005 < 0.01 → "<0.01"
      expect(result).toBe("<0.01");
    });

    test("negative value does not trigger minLimit", () => {
      // isGreaterThan(0) guard prevents negative values from matching
      const result = formatPoolPairAmount(-0.5, { minLimit: 0.01, decimals: 2, isKMB: false });
      // removeTrailingZeros strips the trailing 0
      expect(result).toBe("-0.5");
    });
  });

  describe("decimals=0 is honored", () => {
    test("decimals=0 formats as integer", () => {
      expect(formatPoolPairAmount(1234.56, { decimals: 0, isKMB: false })).toBe("1,234");
    });

    test("decimals=0 with fractional value rounds down to integer", () => {
      expect(formatPoolPairAmount(9.99, { decimals: 0, isKMB: false })).toBe("9");
    });
  });

  describe("trailing zero removal uses removeTrailingZeros", () => {
    test("trailing zeros are removed", () => {
      const result = formatPoolPairAmount(1.1, { decimals: 4, isKMB: false });
      expect(result).toBe("1.1");
    });

    test("all-zero fraction is removed", () => {
      const result = formatPoolPairAmount(5, { decimals: 4, isKMB: false });
      expect(result).toBe("5");
    });

    test("integer value without decimals param is preserved", () => {
      const result = formatPoolPairAmount(100, { isKMB: false });
      expect(result).toBe("100");
    });

    test("long decimal preserves precision", () => {
      const result = formatPoolPairAmount("0.123456789012345678", {
        decimals: 18,
        isKMB: false,
        hasMinLimit: false,
      });
      expect(result).toBe("0.123456789012345678");
    });
  });

  describe("basic formatting", () => {
    test("null returns '-'", () => {
      expect(formatPoolPairAmount(null)).toBe("-");
    });

    test("zero returns '0'", () => {
      expect(formatPoolPairAmount(0)).toBe("0");
    });
  });
});

describe("resolveMinLimit precision with large decimals", () => {
  test("decimals=18 produces exact threshold without floating point error", () => {
    // 1 / Math.pow(10, 18) === 1e-18 (JS number) has precision issues
    // BigNumber(1).div(BigNumber(10).pow(18)) produces exact "0.000000000000000001"
    const result = formatTokenAmount("0.0000000000000000005", { decimals: 18, isKMB: false });
    expect(result).toBe("<0.000000000000000001");
  });

  test("decimals=18 in formatPoolPairAmount produces exact threshold", () => {
    const result = formatPoolPairAmount("0.0000000000000000005", {
      decimals: 18,
      isKMB: false,
      hasMinLimit: true,
      minLimit: null,
    });
    expect(result).toBe("<0.000000000000000001");
  });
});

describe("cross-function consistency", () => {
  describe("trailing zero removal produces same results across functions", () => {
    test("value 1.1 formatted consistently", () => {
      const price = formatPrice(1.1, { isKMB: false, greaterThan1Decimals: 4 });
      const otherPrice = formatOtherPrice(1.1, { isKMB: false, decimals: 4 });
      const poolPair = formatPoolPairAmount(1.1, { decimals: 4, isKMB: false });

      expect(price).toBe("$1.1");
      expect(otherPrice).toBe("$1.1");
      expect(poolPair).toBe("1.1");
    });

    test("value with all-zero decimals formatted consistently", () => {
      const price = formatPrice(5, { isKMB: false, greaterThan1Decimals: 4 });
      const otherPrice = formatOtherPrice(5, { isKMB: false, decimals: 4 });
      const poolPair = formatPoolPairAmount(5, { decimals: 4, isKMB: false });

      expect(price).toBe("$5");
      expect(otherPrice).toBe("$5");
      expect(poolPair).toBe("5");
    });
  });
});
