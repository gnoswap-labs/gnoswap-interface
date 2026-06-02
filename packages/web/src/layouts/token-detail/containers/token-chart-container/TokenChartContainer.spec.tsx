import { formatTokenDetailMainPrice } from "./token-chart-container.utils";

describe("formatTokenDetailMainPrice", () => {
  it("formats large main token prices without compact K/M/B units", () => {
    expect(formatTokenDetailMainPrice(1234)).toBe("$1,234.00");
  });

  it("keeps sub-dollar main token prices at three significant digits", () => {
    expect(formatTokenDetailMainPrice(0.1234)).toBe("$0.123");
  });
});
