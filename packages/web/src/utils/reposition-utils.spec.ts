import { normalizeSwapTokenAmount } from "@utils/reposition-utils";

describe("normalizeSwapTokenAmount", () => {
  it("clamps negative values to zero", () => {
    expect(normalizeSwapTokenAmount(-1)).toBe(0);
  });

  it("keeps positive values", () => {
    expect(normalizeSwapTokenAmount(1.25)).toBe(1.25);
  });
});
