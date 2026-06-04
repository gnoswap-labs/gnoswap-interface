import { renderHook } from "@testing-library/react";

let mockLeaderboardMyInfo: { referralPoint?: string; referrerAddress?: string } | undefined = undefined;

jest.mock("@query/leaderboard", () => ({
  useGetLeaderboardByAddress: () => ({
    data: mockLeaderboardMyInfo,
    refetch: jest.fn(),
  }),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({
    account: { address: "g1testaddress" },
  }),
}));

jest.mock("./use-custom-router", () => () => ({
  getReferrerParameter: () => null,
  pathname: "/",
  query: {},
  replace: jest.fn(),
  push: jest.fn(),
}));

jest.mock("@utils/validation-utils", () => ({
  isValidAddress: (addr: string) => addr.startsWith("g1"),
}));

jest.mock("@states/common", () => ({
  GNOSWAP_REFERRAL_CODE: "GNOSWAP_REFERRAL",
}));

jest.mock("@constants/page.constant", () => ({
  QUERY_PARAMETER: { REFERRER: "referrer" },
}));

import { useReferral } from "./use-referral";

describe("useReferral — referralEarnedPoints derivation", () => {
  beforeEach(() => {
    mockLeaderboardMyInfo = undefined;
  });

  it("returns 0 when leaderboardMyInfo is undefined", () => {
    mockLeaderboardMyInfo = undefined;
    const { result } = renderHook(() => useReferral());
    expect(result.current.referralEarnedPoints).toBe(0);
  });

  it("returns 0 when referralPoint is undefined", () => {
    mockLeaderboardMyInfo = {};
    const { result } = renderHook(() => useReferral());
    expect(result.current.referralEarnedPoints).toBe(0);
  });

  it("returns parsed integer for valid numeric string", () => {
    mockLeaderboardMyInfo = { referralPoint: "42" };
    const { result } = renderHook(() => useReferral());
    expect(result.current.referralEarnedPoints).toBe(42);
  });

  it("returns 0 for non-numeric string", () => {
    mockLeaderboardMyInfo = { referralPoint: "abc" };
    const { result } = renderHook(() => useReferral());
    expect(result.current.referralEarnedPoints).toBe(0);
  });

  it("returns parsed integer ignoring decimals", () => {
    mockLeaderboardMyInfo = { referralPoint: "123.456" };
    const { result } = renderHook(() => useReferral());
    expect(result.current.referralEarnedPoints).toBe(123);
  });
});
