import { formatOtherPrice } from "./new-number-utils";

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
});
