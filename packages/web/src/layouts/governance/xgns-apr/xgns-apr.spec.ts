import { formatXgnsApr, UNAVAILABLE_APR } from "./xgns-apr";

describe("formatXgnsApr", () => {
  it("truncates decimal strings without floating-point rounding or precision loss", () => {
    expect(formatXgnsApr("4.569999999999999999")).toBe("4.56%");
    expect(formatXgnsApr("123456789012345.6789")).toBe("123,456,789,012,345.67%");
    expect(formatXgnsApr("-4.569")).toBe("-4.56%");
  });

  it("distinguishes a small positive APR from zero and groups large values", () => {
    expect(formatXgnsApr("0.005")).toBe("<0.01%");
    expect(formatXgnsApr("0.01")).toBe("0.01%");
    expect(formatXgnsApr("1234.5")).toBe("1,234.50%");
    expect(formatXgnsApr("1,234.567")).toBe("1,234.56%");
  });

  it("preserves a legitimate zero while leaving missing and invalid data unavailable", () => {
    expect(formatXgnsApr("0")).toBe("0.00%");
    for (const value of [undefined, null, "", "  ", "invalid", "Infinity"]) {
      expect(formatXgnsApr(value)).toBe(UNAVAILABLE_APR);
    }
  });
});
