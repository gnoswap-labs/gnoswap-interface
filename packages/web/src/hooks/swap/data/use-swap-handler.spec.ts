import { TokenModel } from "@models/token/token-model";

import { handleAmount } from "./use-swap-handler.utils";

const token = (decimals: number): TokenModel => ({
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Token",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/token",
  decimals,
  symbol: "TOKEN",
  displaySymbol: "TOKEN",
  logoURI: "",
  type: "GRC20",
  priceID: "gno.land/r/token",
});

describe("handleAmount", () => {
  it("keeps over-precision input editable when decimal places are reduced", () => {
    expect(handleAmount("0.0000000", token(6), "0.00000001")).toEqual({
      isValid: true,
      value: "0.0000000",
    });
  });

  it("keeps rejecting newly added over-precision decimal places", () => {
    expect(handleAmount("0.00000001", token(6), "0.0000000")).toEqual({
      isValid: false,
      value: "0.00000001",
    });
  });
});
