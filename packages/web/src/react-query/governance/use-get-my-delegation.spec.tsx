import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider as JotaiProvider } from "jotai";
import React from "react";

import { AccountModel } from "@models/account/account-model";
import { MyDelegationInfo, nullMyDelegationInfo } from "@repositories/governance";
import { WalletState } from "@states/index";

import { useGetMyDelegation } from "./use-get-my-delegation";

const getMyDelegation = jest.fn();

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ governanceRepository: { getMyDelegation } }),
}));

const ADDRESS_A = "g1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const ADDRESS_B = "g1bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const summaryA: MyDelegationInfo = {
  ...nullMyDelegationInfo,
  delegatedAmount: "1000000000",
  votingWeight: "5000000000",
  votingPower: "2500000000",
};

const renderWithClient = (initialAddress: string) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  // No wallet account yet, so the hook starts on the default chain.
  const store = createStore();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <JotaiProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </JotaiProvider>
  );

  const hook = renderHook(({ address }: { address: string }) => useGetMyDelegation({ address }), {
    wrapper,
    initialProps: { address: initialAddress },
  });

  return { ...hook, store };
};

describe("useGetMyDelegation", () => {
  beforeEach(() => {
    getMyDelegation.mockReset();
  });

  it("does not expose the previous address's summary while the new address loads", async () => {
    getMyDelegation.mockResolvedValueOnce(summaryA).mockReturnValueOnce(new Promise(() => undefined));

    const { result, rerender } = renderWithClient(ADDRESS_A);
    await waitFor(() => expect(result.current.data).toEqual(summaryA));

    rerender({ address: ADDRESS_B });

    await waitFor(() => expect(getMyDelegation).toHaveBeenLastCalledWith({ address: ADDRESS_B }));
    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetched).toBe(false);
  });

  it("does not expose another network's summary for the same address", async () => {
    getMyDelegation.mockResolvedValueOnce(summaryA).mockReturnValueOnce(new Promise(() => undefined));

    const { result, store } = renderWithClient(ADDRESS_A);
    await waitFor(() => expect(result.current.data).toEqual(summaryA));

    // Connecting a wallet on a different chain moves the hook off the default chain.
    act(() => {
      store.set(WalletState.account, { address: ADDRESS_A, chainId: "other-chain" } as AccountModel);
    });

    await waitFor(() => expect(getMyDelegation).toHaveBeenCalledTimes(2));
    expect(result.current.data).toBeUndefined();
  });
});
