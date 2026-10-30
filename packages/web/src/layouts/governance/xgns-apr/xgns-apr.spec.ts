import { formatXgnsApr, UNAVAILABLE_APR } from "./xgns-apr";

describe("formatXgnsApr", () => {
  it("truncates decimal strings without floating-point rounding or precision loss", () => {
    expect(formatXgnsApr("4.569999999999999999")).toBe("4.56%");
    expect(formatXgnsApr("123456789012345.6789")).toBe("123456789012345.67%");
    expect(formatXgnsApr("-4.569")).toBe("-4.56%");
  });

  it("preserves a legitimate zero while leaving missing and invalid data unavailable", () => {
    expect(formatXgnsApr("0")).toBe("0.00%");
    for (const value of [undefined, null, "", "  ", "invalid", "Infinity"]) {
      expect(formatXgnsApr(value)).toBe(UNAVAILABLE_APR);
    }
  });
});
