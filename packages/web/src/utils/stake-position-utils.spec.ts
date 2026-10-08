import { formatTokenExchangeRate, getStakingPeriodType } from "./stake-position-utils";

describe("tokenExchangeRateFormat, token exchange rate format", () => {
  test("12347 to 12.34K", () => {
    const num = "12347";

    expect(formatTokenExchangeRate(num)).toBe("12.34K");
  });

  test("10000.4823784 to 10.00K", () => {
    const num = "10000";

    expect(formatTokenExchangeRate(num)).toBe("10.00K");
  });

  test("999 to 999", () => {
    const num = "999";

    expect(formatTokenExchangeRate(num)).toBe("999");
  });

  test("0.123124213 to 0.123124", () => {
    const num = "0.123124213";

    expect(formatTokenExchangeRate(num)).toBe("0.123124");
  });

  test("0.0000023423423423123 to 0.00000234234", () => {
    const num = "0.0000023423423423123";

    expect(formatTokenExchangeRate(num)).toBe("0.00000234234");
  });

  test("0.00000000023423423423123 to 0.000000000234234", () => {
    const num = "0.00000000023423423423123";

    expect(formatTokenExchangeRate(num)).toBe("0.000000000234234");
  });

  test("999.123453 to 999.123", () => {
    const num = "999.123453";

    expect(formatTokenExchangeRate(num)).toBe("999.123");
  });

  test("1 to 1", () => {
    const num = "1";

    expect(formatTokenExchangeRate(num)).toBe("1");
  });
});

describe("getStakingPeriodType", () => {
  const DAY = 24 * 60 * 60 * 1000;
  const stakedAt = "2026-01-01T00:00:00.000Z";
  const stakedTime = new Date(stakedAt).getTime();

  it.each([
    [0, "5D"],
    [5 * DAY - 1, "5D"],
    [5 * DAY, "15D"],
    [15 * DAY - 1, "15D"],
    [15 * DAY, "45D"],
    [45 * DAY - 1, "45D"],
    [45 * DAY, "MAX"],
    [100 * DAY, "MAX"],
  ])("returns the contract warmup tier after %i ms", (elapsed, expected) => {
    expect(getStakingPeriodType(stakedAt, stakedTime + elapsed)).toBe(expected);
  });
});
