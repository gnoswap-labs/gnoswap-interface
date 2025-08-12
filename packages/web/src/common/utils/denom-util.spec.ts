import BigNumber from "bignumber.js";
import {
  toMinimalDenom,
  toDefaultDenom,
  textToBalances,
  amountFormatToBignum,
  createAmountTransformer,
  doubleAmount,
  halveAmount,
  compareAmounts,
  validateAmount,
} from "./denom-util";

describe("denom-util.improved", () => {
  // Test configuration
  const denomConfig = {
    defaultDenom: "GNOT" as string,
    defaultRate: new BigNumber(1),
    minimalDenom: "ugnot" as string,
    minimalRate: new BigNumber(1000000),
  };

  describe("toMinimalDenom", () => {
    it("should convert default denom to minimal denom", () => {
      const amount = {
        value: new BigNumber(1),
        denom: "GNOT",
      };

      const result = toMinimalDenom(amount, denomConfig);
      expect(result.value.toString()).toBe("1000000");
      expect(result.denom).toBe("ugnot");
    });

    it("should return same amount if already in minimal denom", () => {
      const amount = {
        value: new BigNumber(1000000),
        denom: "ugnot",
      };

      const result = toMinimalDenom(amount, denomConfig);
      expect(result.value.toString()).toBe("1000000");
      expect(result.denom).toBe("ugnot");
    });

    it("should handle decimal amounts", () => {
      const amount = {
        value: new BigNumber(0.5),
        denom: "GNOT",
      };

      const result = toMinimalDenom(amount, denomConfig);
      expect(result.value.toString()).toBe("500000");
      expect(result.denom).toBe("ugnot");
    });

    it("should handle case-insensitive denom comparison", () => {
      const amount = {
        value: new BigNumber(1000000),
        denom: "UGNOT", // uppercase
      };

      const result = toMinimalDenom(amount, denomConfig);
      expect(result.value.toString()).toBe("1000000");
      // Original implementation returns the same denom when already minimal
      expect(result.denom).toBe("UGNOT");
    });
  });

  describe("toDefaultDenom", () => {
    it("should convert minimal denom to default denom", () => {
      const amount = {
        value: new BigNumber(1000000),
        denom: "ugnot",
      };

      const result = toDefaultDenom(amount, denomConfig);
      expect(result.value.toString()).toBe("1");
      expect(result.denom).toBe("GNOT");
    });

    it("should return same amount if already in default denom", () => {
      const amount = {
        value: new BigNumber(1),
        denom: "GNOT",
      };

      const result = toDefaultDenom(amount, denomConfig);
      expect(result.value.toString()).toBe("1");
      expect(result.denom).toBe("GNOT");
    });

    it("should handle partial amounts", () => {
      const amount = {
        value: new BigNumber(500000),
        denom: "ugnot",
      };

      const result = toDefaultDenom(amount, denomConfig);
      expect(result.value.toString()).toBe("0.5");
      expect(result.denom).toBe("GNOT");
    });

    it("should handle case-insensitive denom comparison", () => {
      const amount = {
        value: new BigNumber(1),
        denom: "gnot", // lowercase
      };

      const result = toDefaultDenom(amount, denomConfig);
      expect(result.value.toString()).toBe("1");
      // Original implementation returns the same denom when already default
      expect(result.denom).toBe("gnot");
    });
  });

  describe("textToBalances", () => {
    it("should parse single balance", () => {
      const result = textToBalances("100GNOT");
      expect(result).toHaveLength(1);
      expect(result[0].amount).toBe(100);
      expect(result[0].currency).toBe("GNOT");
    });

    it("should parse multiple balances", () => {
      const result = textToBalances("100GNOT,50ATOM,25ETH");
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ amount: 100, currency: "GNOT" });
      expect(result[1]).toEqual({ amount: 50, currency: "ATOM" });
      expect(result[2]).toEqual({ amount: 25, currency: "ETH" });
    });

    it("should handle decimal amounts", () => {
      const result = textToBalances("100.5GNOT,50.25ATOM");
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ amount: 100.5, currency: "GNOT" });
      expect(result[1]).toEqual({ amount: 50.25, currency: "ATOM" });
    });

    it("should handle amounts with spaces", () => {
      const result = textToBalances("100 GNOT, 50 ATOM");
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ amount: 100, currency: "GNOT" });
      expect(result[1]).toEqual({ amount: 50, currency: "ATOM" });
    });

    it("should handle quoted amounts", () => {
      const result = textToBalances("\"100GNOT\"");
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ amount: 100, currency: "GNOT" });
    });

    it("should return empty amount for empty string", () => {
      const result = textToBalances("");
      expect(result).toHaveLength(1);
      // Assuming amountEmptyNumberInit is { amount: 0, currency: "" }
      expect(result[0]).toHaveProperty("amount");
      expect(result[0]).toHaveProperty("currency");
    });

    it("should handle invalid amounts", () => {
      const result = textToBalances("invalid,100GNOT");
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ amount: 100, currency: "GNOT" });
    });

    it("should handle amounts without currency", () => {
      const result = textToBalances("100");
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ amount: 100, currency: "" });
    });
  });

  describe("amountFormatToBignum", () => {
    it("should convert amount with number value", () => {
      const amount = { value: 100, denom: "GNOT" };
      const result = amountFormatToBignum(amount);

      expect(result.value).toBeInstanceOf(BigNumber);
      expect(result.value.toString()).toBe("100");
      expect(result.denom).toBe("GNOT");
    });

    it("should convert amount with string value", () => {
      const amount = { value: "100.5", denom: "GNOT" };
      const result = amountFormatToBignum(amount);

      expect(result.value).toBeInstanceOf(BigNumber);
      expect(result.value.toString()).toBe("100.5");
      expect(result.denom).toBe("GNOT");
    });

    it("should handle BigNumber value", () => {
      const amount = { value: new BigNumber(100), denom: "GNOT" };
      const result = amountFormatToBignum(amount);

      expect(result.value).toBeInstanceOf(BigNumber);
      expect(result.value.toString()).toBe("100");
      expect(result.denom).toBe("GNOT");
    });
  });

  describe("createAmountTransformer", () => {
    it("should create a transformer function", () => {
      const triple = createAmountTransformer(value => value.multipliedBy(3));
      const amount = { value: new BigNumber(10), denom: "GNOT" };

      const result = triple(amount);
      expect(result.value.toString()).toBe("30");
      expect(result.denom).toBe("GNOT");
    });

    it("should preserve original amount properties", () => {
      const addOne = createAmountTransformer(value => value.plus(1));
      const amount = { value: new BigNumber(10), denom: "GNOT" };

      const result = addOne(amount);
      expect(result).not.toBe(amount); // New object
      expect(result.denom).toBe(amount.denom);
    });
  });

  describe("doubleAmount", () => {
    it("should double the amount value", () => {
      const amount = { value: new BigNumber(10), denom: "GNOT" };
      const result = doubleAmount(amount);

      expect(result.value.toString()).toBe("20");
      expect(result.denom).toBe("GNOT");
    });
  });

  describe("halveAmount", () => {
    it("should halve the amount value", () => {
      const amount = { value: new BigNumber(10), denom: "GNOT" };
      const result = halveAmount(amount);

      expect(result.value.toString()).toBe("5");
      expect(result.denom).toBe("GNOT");
    });
  });

  describe("compareAmounts", () => {
    it("should compare equal amounts", () => {
      const a = { value: new BigNumber(10), denom: "GNOT" };
      const b = { value: new BigNumber(10), denom: "GNOT" };

      expect(compareAmounts(a, b)).toBe(0);
    });

    it("should return -1 when first is less", () => {
      const a = { value: new BigNumber(5), denom: "GNOT" };
      const b = { value: new BigNumber(10), denom: "GNOT" };

      expect(compareAmounts(a, b)).toBe(-1);
    });

    it("should return 1 when first is greater", () => {
      const a = { value: new BigNumber(15), denom: "GNOT" };
      const b = { value: new BigNumber(10), denom: "GNOT" };

      expect(compareAmounts(a, b)).toBe(1);
    });

    it("should throw when comparing different denoms", () => {
      const a = { value: new BigNumber(10), denom: "GNOT" };
      const b = { value: new BigNumber(10), denom: "ATOM" };

      expect(() => compareAmounts(a, b)).toThrow("Cannot compare amounts with different denoms: GNOT vs ATOM");
    });
  });

  describe("validateAmount", () => {
    it("should validate valid amount", () => {
      const amount = { value: new BigNumber(10), denom: "GNOT" };
      const result = validateAmount(amount);

      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it("should detect missing denom", () => {
      const amount = { value: new BigNumber(10), denom: "" };
      const result = validateAmount(amount);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Denom is required");
    });

    it("should detect invalid value", () => {
      const amount = { value: new BigNumber(NaN), denom: "GNOT" };
      const result = validateAmount(amount);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid amount value");
    });

    it("should detect negative value", () => {
      const amount = { value: new BigNumber(-10), denom: "GNOT" };
      const result = validateAmount(amount);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Amount cannot be negative");
    });

    it("should detect multiple errors", () => {
      const amount = { value: new BigNumber(-10), denom: "" };
      const result = validateAmount(amount);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain("Denom is required");
      expect(result.errors).toContain("Amount cannot be negative");
    });

    it("should handle null/undefined value", () => {
      const amount = { value: null as unknown, denom: "GNOT" };
      const result = validateAmount(amount);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid amount value");
    });
  });
});

