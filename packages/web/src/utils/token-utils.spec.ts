import { TokenModel } from "@models/token/token-model";
import { makeDisplayTokenAmount, makeRawTokenAmount } from "./token-utils";

const DEFAULT_TOKEN: TokenModel = {
  decimals: 6,
  path: "",
  address: "",
  type: "grc20",
  priceID: "",
  chainId: "",
  name: "",
  symbol: "",
  logoURI: "",
  createdAt: "",
};

describe("make token raw price", () => {
  test("1 to 1000000", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = 1;
    const result = makeRawTokenAmount(token, amount);
    expect(result).toBe("1000000");
  });

  test("0.123456 to 123456", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = 0.123456;
    const result = makeRawTokenAmount(token, amount);
    expect(result).toBe("123456");
  });

  test("0.123456789 to 123456", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = 0.123456789;
    const result = makeRawTokenAmount(token, amount);
    expect(result).toBe("123456");
  });
});

describe("make token display price", () => {
  test("1000000 to 1", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = 1000000;
    const result = makeDisplayTokenAmount(token, amount);
    expect(result).toBe(1);
  });

  test("1 to 0.000001", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = 1;
    const result = makeDisplayTokenAmount(token, amount);
    expect(result).toBe(0.000001);
  });

  test("'1' to 0.000001", () => {
    const token = {
      ...DEFAULT_TOKEN,
      decimals: 6,
    };
    const amount = "1";
    const result = makeDisplayTokenAmount(token, amount);
    expect(result).toBe(0.000001);
  });
});
