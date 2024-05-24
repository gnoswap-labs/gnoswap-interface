import { numberToRate } from "./string-utils";

describe("numberToRate, number value to rate format", () => {
  test("100 to 100.0%", () => {
    const num = "100";

    expect(numberToRate(num)).toBe("100.0%");
  });

  test("50 to 50.0%", () => {
    const num = "50";

    expect(numberToRate(num)).toBe("50.0%");
  });

  test("0.1 to 0.1%", () => {
    const num = "0.1";

    expect(numberToRate(num)).toBe("0.1%");
  });

  test("0.09 to <0.1%", () => {
    const num = "0.09";

    expect(numberToRate(num)).toBe("<0.1%");
  });
});
