import { formatPrice } from "./new-number-utils";

describe("formatPrice minimum display limit", () => {
  it("uses the configured minimum label for positive values below the limit", () => {
    expect(formatPrice("0.000000113", { isKMB: false, minLimit: 0.01 })).toBe("<$0.01");
  });

  it("keeps the exact minimum value on the existing formatting path", () => {
    expect(formatPrice("0.01", { isKMB: false, minLimit: 0.01 })).toBe("$0.0100");
  });

  it("keeps zero displayed as zero", () => {
    expect(formatPrice("0", { isKMB: false, minLimit: 0.01 })).toBe("$0");
  });

  it("keeps values above the minimum on the existing formatting path", () => {
    expect(formatPrice("0.123", { isKMB: false, minLimit: 0.01 })).toBe("$0.123");
  });
});
