import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { IBalancesByAddressResponse } from "@repositories/token/response/balance-by-address-response";
import { QUERY_KEY } from "../query-keys";
import { useGetGrc20Balances } from "./use-get-grc20-balances";

const getGrc20BalancesByAddress = jest.fn();
const wallet = { currentChainId: "chain-a" };
const balances: IBalancesByAddressResponse = {
  data: [{ path: "gno.land/r/demo/usdc", amount: "100" }],
  message: "success",
};

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ tokenRepository: { getGrc20BalancesByAddress } }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({ useWallet: () => wallet }));

const renderBalances = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: 0 } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return {
    ...renderHook(({ address }) => useGetGrc20Balances(address, { refetchInterval: false }), {
      wrapper,
      initialProps: { address: "g1first" },
    }),
    queryClient,
  };
};

describe("useGetGrc20Balances wallet cache identity", () => {
  beforeEach(() => {
    wallet.currentChainId = "chain-a";
    getGrc20BalancesByAddress.mockReset().mockResolvedValue(balances);
  });

  it("retains same-wallet data during an address-prefix invalidation", async () => {
    const { result, queryClient } = renderBalances();
    await waitFor(() => expect(result.current.data).toEqual(balances));
    expect(result.current.isFetching).toBe(false);
    getGrc20BalancesByAddress.mockReturnValue(new Promise(() => {}));
    await act(async () => {
      void queryClient.invalidateQueries([QUERY_KEY.tokenBalancesByAddress, "g1first"]);
    });
    await waitFor(() => expect(result.current.isFetching).toBe(true));
    expect(queryClient.getQueryState([QUERY_KEY.tokenBalancesByAddress, "g1first", "chain-a"])?.fetchStatus).toBe(
      "fetching",
    );
    expect(result.current.data).toEqual(balances);
    expect(result.current.isLoading).toBe(false);
    expect(getGrc20BalancesByAddress).toHaveBeenCalledTimes(2);
  });

  it.each(["address", "chain"])("drops previous amounts immediately when %s changes", async identity => {
    const { result, rerender } = renderBalances();
    await waitFor(() => expect(result.current.data).toEqual(balances));
    getGrc20BalancesByAddress.mockReturnValue(new Promise(() => {}));
    if (identity === "chain") {
      wallet.currentChainId = "chain-b";
    }
    rerender({ address: identity === "address" ? "g1second" : "g1first" });
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(getGrc20BalancesByAddress).toHaveBeenLastCalledWith(identity === "address" ? "g1second" : "g1first");
  });
});
