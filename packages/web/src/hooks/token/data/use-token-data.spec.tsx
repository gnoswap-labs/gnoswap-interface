import { renderHook } from "@testing-library/react";
import { GNOT_TOKEN } from "@common/values/token-constant";
import { TokenModel } from "@models/token/token-model";

import { useTokenData } from "./use-token-data";

const useGetGrc20Balances = jest.fn();
const token: TokenModel = {
  ...GNOT_TOKEN,
  path: "gno.land/r/demo/usdc",
  priceID: "USDC",
  type: "GRC20",
};
const tokenQuery = { data: { tokens: [] as TokenModel[] }, isFetched: true, isLoading: false };
const wallet: {
  account: { address: string };
  gnotBalance: number | undefined;
  availNetwork: boolean;
  isLoadingGnotBalance: boolean;
} = {
  account: { address: "g1test" },
  gnotBalance: 0,
  availNetwork: true,
  isLoadingGnotBalance: false,
};

jest.mock("@query/token", () => ({
  useGetTokens: () => tokenQuery,
  useGetAllTokenPrices: () => ({ data: {}, isFetched: true }),
  useGetGrc20Balances: (...args: unknown[]) => useGetGrc20Balances(...args),
  useGetSwapExtensionBalances: () => ({
    data: {},
    errors: {},
    loading: {},
    refetch: jest.fn(),
  }),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => wallet,
}));

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ rpcProvider: null }),
}));

jest.mock("./use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ getGnotPath: (token: unknown) => token }),
}));

describe("useTokenData balance availability", () => {
  beforeEach(() => {
    tokenQuery.data.tokens = [];
    tokenQuery.isLoading = false;
    wallet.account.address = "g1test";
    wallet.gnotBalance = 0;
    wallet.isLoadingGnotBalance = false;
  });

  it("does not mark a null GRC20 payload as available, but accepts an empty balance list", () => {
    useGetGrc20Balances.mockReturnValue({ data: { data: null }, isLoading: false });
    const { result, rerender } = renderHook(() => useTokenData());
    expect(result.current.hasBalanceData).toBe(false);

    useGetGrc20Balances.mockReturnValue({ data: { data: [] }, isLoading: false });
    rerender();
    expect(result.current.hasBalanceData).toBe(true);
  });

  it("derives current wallet amounts directly and retains them during refetch", () => {
    tokenQuery.data.tokens = [GNOT_TOKEN, token];
    wallet.gnotBalance = 100;
    useGetGrc20Balances.mockReturnValue({ data: { data: [{ path: token.path, amount: "200" }] }, isLoading: false });
    const { result, rerender } = renderHook(() => useTokenData());
    expect(result.current.walletBalances).toEqual({ [GNOT_TOKEN.path]: 100, [token.path]: "200" });

    useGetGrc20Balances.mockReturnValue({ data: { data: [{ path: token.path, amount: "200" }] }, isLoading: true });
    rerender();
    expect(result.current.hasBalanceData).toBe(true);
    expect(result.current.isLoadingBalanceData).toBe(true);
    expect(result.current.walletBalances).toEqual({ [GNOT_TOKEN.path]: 100, [token.path]: "200" });

    wallet.account.address = "g1new";
    wallet.gnotBalance = undefined;
    wallet.isLoadingGnotBalance = true;
    useGetGrc20Balances.mockReturnValue({ data: undefined, isLoading: true });
    rerender();
    expect(result.current.hasBalanceData).toBe(false);
    expect(result.current.walletBalances).toEqual({ [GNOT_TOKEN.path]: null, [token.path]: null });

    wallet.gnotBalance = 10;
    useGetGrc20Balances.mockReturnValue({ data: { data: [{ path: token.path, amount: "20" }] }, isLoading: false });
    rerender();
    expect(result.current.walletBalances).toEqual({ [GNOT_TOKEN.path]: 10, [token.path]: "20" });
  });

  it("keeps missing native data unavailable and includes pending metadata in wallet loading", () => {
    useGetGrc20Balances.mockReturnValue({ data: { data: [] }, isLoading: false });
    wallet.gnotBalance = undefined;
    wallet.isLoadingGnotBalance = true;
    const { result, rerender } = renderHook(() => useTokenData());
    expect(result.current.hasBalanceData).toBe(false);
    expect(result.current.isLoadingBalanceData).toBe(false);

    wallet.gnotBalance = 0;
    wallet.isLoadingGnotBalance = false;
    tokenQuery.isLoading = true;
    rerender();
    expect(result.current.isLoadingBalanceData).toBe(true);
    expect(result.current.walletBalances).toEqual({});
  });
});
