import { TokenModel } from "@models/token/token-model";

import { isVerificationVisible, keepVerified } from "./token-verification-filter";

const makeToken = (overrides: Partial<TokenModel>): TokenModel => ({
  path: "gno.land/r/demo/token",
  type: "GRC20",
  chainId: "dev",
  name: "Token",
  symbol: "TKN",
  displaySymbol: "TKN",
  decimals: 6,
  logoURI: "",
  createdAt: "2024-01-01T00:00:00Z",
  priceID: "gno.land/r/demo/token",
  ...overrides,
});

const verified = makeToken({ name: "V", isVerified: true });
const unverified = makeToken({ name: "U", isVerified: false });
const missingFlag = makeToken({ name: "M" });

describe("isVerificationVisible", () => {
  it("shows verified tokens by default", () => {
    expect(isVerificationVisible(verified, false)).toBe(true);
  });

  it("hides unverified tokens by default", () => {
    expect(isVerificationVisible(unverified, false)).toBe(false);
  });

  it("treats a missing isVerified flag as unverified", () => {
    expect(isVerificationVisible(missingFlag, false)).toBe(false);
  });

  it("shows every token when showUnverified is true", () => {
    expect(isVerificationVisible(verified, true)).toBe(true);
    expect(isVerificationVisible(unverified, true)).toBe(true);
    expect(isVerificationVisible(missingFlag, true)).toBe(true);
  });
});

describe("keepVerified", () => {
  const tokens = [verified, unverified, missingFlag];

  it("returns only verified tokens when showUnverified is false", () => {
    expect(keepVerified(tokens, false)).toEqual([verified]);
  });

  it("returns all tokens when showUnverified is true", () => {
    expect(keepVerified(tokens, true)).toEqual(tokens);
  });

  it("does not keep tokens with a missing isVerified flag when showUnverified is false", () => {
    expect(keepVerified(tokens, false)).not.toContain(missingFlag);
  });

  it("returns an empty array for empty input", () => {
    expect(keepVerified([], false)).toEqual([]);
    expect(keepVerified([], true)).toEqual([]);
  });
});
