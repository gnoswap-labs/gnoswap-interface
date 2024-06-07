import { formatTokenExchangeRate } from './stake-position-utils';

describe("tokenExchangeRateFormat, token exchange rate format", () => {
  test("12347 to 12.35K", () => {
    const num = "12347";

    expect(formatTokenExchangeRate(num)).toBe("12.35K");
  });

  test("10000.4823784 to 10.00K", () => {
    const num = "10000";

    expect(formatTokenExchangeRate(num)).toBe("10.00K");
  });

  test("999 to 999", () => {
    const num = "999";

    expect(formatTokenExchangeRate(num)).toBe("999");
  });

  test("0.123124213 to 0.12312", () => {
    const num = "0.123124213";

    expect(formatTokenExchangeRate(num)).toBe("0.12312");
  });

  test("0.0000023423423423123 to 0.0000023423", () => {
    const num = "0.0000023423423423123";

    expect(formatTokenExchangeRate(num)).toBe("0.0000023423");
  });

  test("0.00000000023423423423123 to 0.00000000023423", () => {
    const num = "0.00000000023423423423123";

    expect(formatTokenExchangeRate(num)).toBe("0.00000000023423");
  });

  test("999.123453 to 999.12", () => {
    const num = "999.123453";

    expect(formatTokenExchangeRate(num)).toBe("999.12");
  });
});
