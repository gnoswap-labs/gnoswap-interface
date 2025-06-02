import { AmountConverter } from "./amount.converter";
import { TokenModel } from "@models/token/token-model";

describe("AmountConverter", () => {
  const gnsToken = {
    decimals: 6,
    symbol: "GNS",
  } as TokenModel;

  const wethToken = {
    decimals: 18,
    symbol: "WETH",
  } as TokenModel;

  const tokenWithoutDecimals = {
    symbol: "TEST",
  } as TokenModel;

  describe("AmountConverter.convertSingle", () => {
    describe("✅ Normal case", () => {
      it("String to Number Conversion", () => {
        expect(AmountConverter.convertSingle(gnsToken, "1000000")).toBe("1");
        expect(AmountConverter.convertSingle(gnsToken, "500000")).toBe("0.5");
        expect(AmountConverter.convertSingle(gnsToken, "1000000000000")).toBe("1000000");
      });

      it("Number conversion", () => {
        expect(AmountConverter.convertSingle(gnsToken, 1000000)).toBe("1");
        expect(AmountConverter.convertSingle(gnsToken, 500000)).toBe("0.5");
        expect(AmountConverter.convertSingle(gnsToken, 1000000000000)).toBe("1000000");
      });

      it("0 values", () => {
        expect(AmountConverter.convertSingle(gnsToken, "0")).toBe("0");
        expect(AmountConverter.convertSingle(gnsToken, 0)).toBe("0");
      });

      it("Negative numbers", () => {
        expect(AmountConverter.convertSingle(gnsToken, "-1000000")).toBe("-1");
        expect(AmountConverter.convertSingle(gnsToken, -500000)).toBe("-0.5");
      });
    });

    describe("🛡️ NULL/UNDEFINED safety handling", () => {
      it("token: null/undefined", () => {
        // @ts-expect-error: Testing what can happen at runtime
        expect(AmountConverter.convertSingle(null, "1000000")).toBe("0");
        // @ts-expect-error: Testing what can happen at runtime
        expect(AmountConverter.convertSingle(undefined, "1000000")).toBe("0");
      });

      it("rawAmount: null/undefined", () => {
        // @ts-expect-error: Testing what can happen at runtime
        expect(AmountConverter.convertSingle(gnsToken, null)).toBe("0");
        // @ts-expect-error: Testing what can happen at runtime
        expect(AmountConverter.convertSingle(gnsToken, undefined)).toBe("0");
      });

      it("Both null/undefined", () => {
        // @ts-expect-error: Testing what can happen at runtime
        expect(AmountConverter.convertSingle(null, null)).toBe("0");
        // @ts-expect-error: Testing what can happen at runtime
        expect(AmountConverter.convertSingle(undefined, undefined)).toBe("0");
      });
    });

    describe("Handling special numeric values", () => {
      it("NaN", () => {
        expect(AmountConverter.convertSingle(gnsToken, NaN)).toBe("0");
      });

      it("Infinity", () => {
        expect(AmountConverter.convertSingle(gnsToken, Infinity)).toBe("0");
        expect(AmountConverter.convertSingle(gnsToken, -Infinity)).toBe("0");
      });

      it("Very large numbers", () => {
        // Testing the IEEE 754 floating-point limit in JavaScript
        // Number.MAX_SAFE_INTEGER = 9,007,199,254,740,991 (2^53 - 1)
        // integers larger than this may lose accuracy and should be treated as strings

        // 100 trillion raw units (6 decimals) -> 100 billion tokens
        // String processing required because 100,000,000,000,000,000,000 > MAX_SAFE_INTEGER
        expect(AmountConverter.convertSingle(gnsToken, "100000000000000000")).toBe("100000000000");
        expect(AmountConverter.convertSingle(gnsToken, 100000000000000000)).toBe("100000000000");

        // 900 trillion raw units (6 decimals) -> 900 billion tokens
        // Test for possible loss of floating-point precision
        expect(AmountConverter.convertSingle(gnsToken, "900000000000000000")).toBe("900000000000");
        expect(AmountConverter.convertSingle(gnsToken, 900000000000000000)).toBe("900000000000");

        // 900 sextillion raw units (6 decimals) -> 900 quintillion tokens
        // Extremely large numbers:
        expect(AmountConverter.convertSingle(gnsToken, "900000000000000000000000")).toBe("900000000000000000");
        expect(AmountConverter.convertSingle(gnsToken, 900000000000000000000000)).toBe("900000000000000000");
      });

      test("Very small numbers", () => {
        // Minimal unit test at 18 decimals (WETH)
        // 1 wei = 0.000000000000000001 ETH
        // Test extreme precision of IEEE 754 double precision
        expect(AmountConverter.convertSingle(wethToken, 1)).toBe("0.000000000000000001");
        expect(AmountConverter.convertSingle(wethToken, "1")).toBe("0.000000000000000001");
      });
    });

    describe("String edge cases", () => {
      it("empty string", () => {
        expect(AmountConverter.convertSingle(gnsToken, "")).toBe("0");
      });

      it("Blank string", () => {
        expect(AmountConverter.convertSingle(gnsToken, "   ")).toBe("0");
        expect(AmountConverter.convertSingle(gnsToken, " 1000000 ")).toBe("1");
      });

      it("Invalid string", () => {
        expect(AmountConverter.convertSingle(gnsToken, "abc")).toBe("0");
        expect(AmountConverter.convertSingle(gnsToken, "12.34.56")).toBe("0");
        expect(AmountConverter.convertSingle(gnsToken, "1e")).toBe("0");
        expect(AmountConverter.convertSingle(gnsToken, "++123")).toBe("0");
      });

      test("Scientific notation", () => {
        expect(AmountConverter.convertSingle(gnsToken, "1e6")).toBe("1");
        expect(AmountConverter.convertSingle(gnsToken, "1.5e6")).toBe("1.5");
      });

      test("Hexadecimal string", () => {
        // 0x1000 = 4096
        const hexValue = parseInt("0x1000"); // 4096
        const expected = (hexValue / Math.pow(10, 6)).toString(); // "0.004096"

        expect(AmountConverter.convertSingle(gnsToken, "0x1000")).toBe(expected);
      });
    });

    describe("Token configuration edge cases", () => {
      it("Missing decimals property", () => {
        expect(AmountConverter.convertSingle(tokenWithoutDecimals, "1000")).toBe("1000");
        expect(AmountConverter.convertSingle(tokenWithoutDecimals, 1000)).toBe("1000");
      });

      it("Invalid decimals values", () => {
        const invalidDecimalsToken = { decimals: -1, symbol: "INVALID" } as TokenModel;
        const zeroDecimalsToken = { decimals: 0, symbol: "ZERO" } as TokenModel;
        const floatDecimalsToken = { decimals: 6.5, symbol: "FLOAT" } as TokenModel;

        // Negative decimals (-1) are converted to positive
        expect(AmountConverter.convertSingle(invalidDecimalsToken, "1000")).toBe("100");
        // Zero decimals (0) remain unchanged
        expect(AmountConverter.convertSingle(zeroDecimalsToken, "1000")).toBe("1000");
        // Float decimals (6.5) are floored to integer (6)
        expect(AmountConverter.convertSingle(floatDecimalsToken, "1000000")).toBe("1");
      });

      it("Null/undefined decimals property", () => {
        // @ts-expect-error: Testing what can happen at runtime
        const nullDecimalsToken = { decimals: null, symbol: "NULL" } as TokenModel;
        // @ts-expect-error: Testing what can happen at runtime
        const undefinedDecimalsToken = { decimals: undefined, symbol: "UNDEFINED" } as TokenModel;

        // Null decimals handling
        expect(AmountConverter.convertSingle(nullDecimalsToken, "1000")).toBe("1000");
        expect(AmountConverter.convertSingle(nullDecimalsToken, 1000)).toBe("1000");

        // Undefined decimals handling
        expect(AmountConverter.convertSingle(undefinedDecimalsToken, "1000")).toBe("1000");
        expect(AmountConverter.convertSingle(undefinedDecimalsToken, 1000)).toBe("1000");
      });
    });
  });
});
