import { renderHook } from "@testing-library/react";

import { useTokenData } from "./use-token-data";

const useGetGrc20Balances = jest.fn();

jest.mock("@query/token", () => ({
  useGetTokens: () => ({ data: { tokens: [] }, isFetched: true }),
  useGetAllTokenPrices: () => ({ data: {}, isFetched: true }),
  useGetGrc20Balances: (...args: unknown[]) => useGetGrc20Balances(...args),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ account: { address: "g1test" }, gnotBalance: 0, availNetwork: true }),
}));

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ rpcProvider: null }),
}));

jest.mock("./use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ getGnotPath: (token: unknown) => token }),
}));

describe("useTokenData balance availability", () => {
  it("does not mark a null GRC20 payload as available, but accepts an empty balance list", () => {
    useGetGrc20Balances.mockReturnValue({ data: { data: null }, isLoading: false });
    const { result, rerender } = renderHook(() => useTokenData());
    expect(result.current.hasBalanceData).toBe(false);

    useGetGrc20Balances.mockReturnValue({ data: { data: [] }, isLoading: false });
    rerender();
    expect(result.current.hasBalanceData).toBe(true);
  });
});
