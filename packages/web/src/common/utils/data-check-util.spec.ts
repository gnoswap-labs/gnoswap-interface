import {
  getType,
  emptyStrCheckAfterTrim,
  isNotNullOrUndefined,
  isNotNullString,
  isNonEmptyString,
  validateAmount,
  isAmount,
  isNumericString,
  isPositiveNumber,
  isArrayOf,
} from "./data-check-util";

describe("data-check-util.improved", () => {
  describe("getType", () => {
    it("should return correct type names for primitives", () => {
      expect(getType("hello")).toBe("String");
      expect(getType(123)).toBe("Number");
      expect(getType(true)).toBe("Boolean");
      expect(getType(null)).toBe("Null");
      expect(getType(undefined)).toBe("Undefined");
    });

    it("should return correct type names for objects", () => {
      expect(getType({})).toBe("Object");
      expect(getType([])).toBe("Array");
      expect(getType(new Date())).toBe("Date");
      expect(getType(/regex/)).toBe("RegExp");
      expect(getType(() => undefined)).toBe("Function");
    });

    it("should handle edge cases", () => {
      expect(getType(NaN)).toBe("Number");
      expect(getType(Infinity)).toBe("Number");
      expect(getType(Symbol("test"))).toBe("Symbol");
      expect(getType(BigInt(123))).toBe("BigInt");
    });
  });

  describe("emptyStrCheckAfterTrim", () => {
    it("should return true for non-empty strings", () => {
      expect(emptyStrCheckAfterTrim("hello")).toBe(true);
      expect(emptyStrCheckAfterTrim("  hello  ")).toBe(true);
      expect(emptyStrCheckAfterTrim(" a ")).toBe(true);
    });

    it("should return false for empty strings", () => {
      expect(emptyStrCheckAfterTrim("")).toBe(false);
      expect(emptyStrCheckAfterTrim("   ")).toBe(false);
      expect(emptyStrCheckAfterTrim("\t\n")).toBe(false);
    });
  });

  describe("isNotNullOrUndefined", () => {
    it("should return true for defined values", () => {
      expect(isNotNullOrUndefined("")).toBe(true);
      expect(isNotNullOrUndefined(0)).toBe(true);
      expect(isNotNullOrUndefined(false)).toBe(true);
      expect(isNotNullOrUndefined([])).toBe(true);
      expect(isNotNullOrUndefined({})).toBe(true);
    });

    it("should return false for null and undefined", () => {
      expect(isNotNullOrUndefined(null)).toBe(false);
      expect(isNotNullOrUndefined(undefined)).toBe(false);
    });

    it("should work as type guard", () => {
      const value: string | null | undefined = "test";
      if (isNotNullOrUndefined(value)) {
        // TypeScript should know value is string here
        expect(value.length).toBe(4);
      }
    });
  });

  describe("isNotNullString", () => {
    it("should return true for valid strings", () => {
      expect(isNotNullString("hello")).toBe(true);
      expect(isNotNullString("")).toBe(true);
      expect(isNotNullString("   ")).toBe(true);
    });

    it("should return false for non-strings", () => {
      expect(isNotNullString(123)).toBe(false);
      expect(isNotNullString(null)).toBe(false);
      expect(isNotNullString(undefined)).toBe(false);
      expect(isNotNullString({})).toBe(false);
      expect(isNotNullString([])).toBe(false);
      expect(isNotNullString(true)).toBe(false);
    });
  });

  describe("isNonEmptyString", () => {
    it("should return true for non-empty strings", () => {
      expect(isNonEmptyString("hello")).toBe(true);
      expect(isNonEmptyString("  hello  ")).toBe(true);
      expect(isNonEmptyString(" a ")).toBe(true);
    });

    it("should return false for empty strings", () => {
      expect(isNonEmptyString("")).toBe(false);
      expect(isNonEmptyString("   ")).toBe(false);
      expect(isNonEmptyString("\t\n")).toBe(false);
    });

    it("should return false for non-strings", () => {
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
    });
  });

  describe("validateAmount", () => {
    it("should validate amounts with dot separator", () => {
      const result = validateAmount("123.45");
      expect(result.isValid).toBe(true);
      expect(result.separator).toBe(".");
      expect(result.integerPart).toBe("123");
      expect(result.decimalPart).toBe("45");
    });

    it("should validate amounts with comma separator", () => {
      const result = validateAmount("123,45");
      expect(result.isValid).toBe(true);
      expect(result.separator).toBe(",");
      expect(result.integerPart).toBe("123");
      expect(result.decimalPart).toBe("45");
    });

    it("should validate integer amounts", () => {
      const result = validateAmount("123");
      expect(result.isValid).toBe(true);
      expect(result.integerPart).toBe("123");
      expect(result.decimalPart).toBeUndefined();
    });

    it("should validate amounts with empty decimal part", () => {
      const resultDot = validateAmount("123.");
      expect(resultDot.isValid).toBe(true);
      expect(resultDot.integerPart).toBe("123");
      expect(resultDot.decimalPart).toBe("");

      const resultComma = validateAmount("123,");
      expect(resultComma.isValid).toBe(true);
      expect(resultComma.integerPart).toBe("123");
      expect(resultComma.decimalPart).toBe("");
    });

    it("should reject invalid amounts", () => {
      expect(validateAmount("abc").isValid).toBe(false);
      expect(validateAmount("12.34.56").isValid).toBe(false);
      expect(validateAmount("12,34,56").isValid).toBe(false);
      expect(validateAmount(".123").isValid).toBe(false);
      expect(validateAmount(",123").isValid).toBe(false);
      expect(validateAmount("123a").isValid).toBe(false);
      expect(validateAmount("a123").isValid).toBe(false);
      expect(validateAmount("").isValid).toBe(false);
    });
  });

  describe("isAmount", () => {
    it("should return true for valid amounts", () => {
      expect(isAmount("123")).toBe(true);
      expect(isAmount("123.45")).toBe(true);
      expect(isAmount("123,45")).toBe(true);
      expect(isAmount("0")).toBe(true);
      expect(isAmount("0.0")).toBe(true);
      expect(isAmount("123.")).toBe(true);
      expect(isAmount("123,")).toBe(true);
    });

    it("should return false for invalid amounts", () => {
      expect(isAmount("")).toBe(false);
      expect(isAmount("abc")).toBe(false);
      expect(isAmount("12.34.56")).toBe(false);
      expect(isAmount(".123")).toBe(false);
      expect(isAmount("-123")).toBe(false);
      expect(isAmount("+123")).toBe(false);
    });
  });

  describe("isNumericString", () => {
    it("should return true for numeric strings", () => {
      expect(isNumericString("123")).toBe(true);
      expect(isNumericString("123.45")).toBe(true);
      expect(isNumericString("-123")).toBe(true);
      expect(isNumericString("0")).toBe(true);
      expect(isNumericString("1e5")).toBe(true);
      expect(isNumericString("0.123")).toBe(true);
    });

    it("should return false for non-numeric strings", () => {
      expect(isNumericString("abc")).toBe(false);
      expect(isNumericString("12a34")).toBe(false);
      expect(isNumericString("")).toBe(false);
      expect(isNumericString("   ")).toBe(false);
      expect(isNumericString("NaN")).toBe(false);
      expect(isNumericString("Infinity")).toBe(false);
    });

    it("should return false for non-strings", () => {
      expect(isNumericString(123)).toBe(false);
      expect(isNumericString(null)).toBe(false);
      expect(isNumericString(undefined)).toBe(false);
      expect(isNumericString({})).toBe(false);
    });
  });

  describe("isPositiveNumber", () => {
    it("should return true for positive numbers", () => {
      expect(isPositiveNumber(1)).toBe(true);
      expect(isPositiveNumber(0.1)).toBe(true);
      expect(isPositiveNumber(999999)).toBe(true);
      expect(isPositiveNumber(Number.MIN_VALUE)).toBe(true);
    });

    it("should return false for non-positive numbers", () => {
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-1)).toBe(false);
      expect(isPositiveNumber(-0.1)).toBe(false);
      expect(isPositiveNumber(NaN)).toBe(false);
      expect(isPositiveNumber(Infinity)).toBe(false);
      expect(isPositiveNumber(-Infinity)).toBe(false);
    });

    it("should return false for non-numbers", () => {
      expect(isPositiveNumber("1")).toBe(false);
      expect(isPositiveNumber(null)).toBe(false);
      expect(isPositiveNumber(undefined)).toBe(false);
      expect(isPositiveNumber({})).toBe(false);
    });
  });

  describe("isArrayOf", () => {
    it("should validate arrays of strings", () => {
      expect(isArrayOf(["a", "b", "c"], isNotNullString)).toBe(true);
      expect(isArrayOf([], isNotNullString)).toBe(true);
      expect(isArrayOf(["a", 1, "c"], isNotNullString)).toBe(false);
      expect(isArrayOf(["a", null, "c"], isNotNullString)).toBe(false);
    });

    it("should validate arrays of numbers", () => {
      expect(isArrayOf([1, 2, 3], isPositiveNumber)).toBe(true);
      expect(isArrayOf([1, 0, 3], isPositiveNumber)).toBe(false);
      expect(isArrayOf([1, -1, 3], isPositiveNumber)).toBe(false);
    });

    it("should return false for non-arrays", () => {
      expect(isArrayOf("not an array", isNotNullString)).toBe(false);
      expect(isArrayOf(null, isNotNullString)).toBe(false);
      expect(isArrayOf(undefined, isNotNullString)).toBe(false);
      expect(isArrayOf({}, isNotNullString)).toBe(false);
    });

    it("should work as type guard", () => {
      const value: unknown = ["hello", "world"];
      if (isArrayOf(value, isNotNullString)) {
        // TypeScript should know value is string[] here
        expect(value[0].toUpperCase()).toBe("HELLO");
      }
    });
  });
});

