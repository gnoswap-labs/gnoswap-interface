import { priceToNearTick, priceToTick, tickToPrice } from "./swap-utils";

describe("tick convert to price", () => {
  test("0 to 1", () => {
    const tick = 0;
    expect(tickToPrice(tick)).toBe(1);
  });

  test("10000 to 1.6486800559311758", () => {
    const tick = 10000;
    expect(tickToPrice(tick)).toBe(1.6486800559311758);
  });

  test("10001 to 1.6487624878732252", () => {
    const tick = 10001;
    expect(tickToPrice(tick)).toBe(1.6487624878732252);
  });
});

describe("price convert to tick", () => {
  test("1 to 0", () => {
    const price = 1;
    expect(priceToTick(price)).toBe(0);
  });

  test("1.6486800559311758 to 10000", () => {
    const price = 1.6486800559311758;
    expect(priceToTick(price)).toBe(10000);
  });

  test("1.6487624878732252 to 10001", () => {
    const price = 1.6487624878732252;
    expect(priceToTick(price)).toBe(10001);
  });

  test("0.60651549714 to -10001", () => {
    const price = 0.60651549714;
    expect(priceToTick(price)).toBe(-10001);
  });
});

describe("price convert to near tick", () => {
  test("1 to 0", () => {
    const price = 1;
    const tickSpacing = 2;
    expect(priceToNearTick(price, tickSpacing)).toBe(0);
  });

  test("1.6486800559311758 to 10002", () => {
    const price = 1.6489273641220126;
    const tickSpacing = 2;
    expect(priceToNearTick(price, tickSpacing)).toBe(10002);
  });

  test("0.60651549714 to -10002", () => {
    const price = 0.60651549714;
    const tickSpacing = 2;
    expect(priceToNearTick(price, tickSpacing)).toBe(-10002);
  });

  test("0.60651549714 to -10004", () => {
    const price = 0.60651549714;
    const tickSpacing = 4;
    expect(priceToNearTick(price, tickSpacing)).toBe(-10004);
  });
});
