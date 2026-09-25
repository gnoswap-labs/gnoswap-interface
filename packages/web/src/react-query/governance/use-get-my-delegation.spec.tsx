import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { MyDelegationInfo, nullMyDelegationInfo } from "@repositories/governance";

import { useGetMyDelegation } from "./use-get-my-delegation";

const getMyDelegation = jest.fn();
let currentChainId = "chain-a";

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ governanceRepository: { getMyDelegation } }),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ currentChainId }),
}));

const ADDRESS_A = "g1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const ADDRESS_B = "g1bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const summaryA: MyDelegationInfo = { ...nullMyDelegationInfo, delegatedAmount: "1000000000", votingWeight: "5000000000" };

const renderWithClient = (initialAddress: string) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(({ address }: { address: string }) => useGetMyDelegation({ address }), {
    wrapper,
    initialProps: { address: initialAddress },
  });
};

describe("useGetMyDelegation", () => {
  beforeEach(() => {
    getMyDelegation.mockReset();
    currentChainId = "chain-a";
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

    const { result, rerender } = renderWithClient(ADDRESS_A);
    await waitFor(() => expect(result.current.data).toEqual(summaryA));

    currentChainId = "chain-b";
    rerender({ address: ADDRESS_A });

    await waitFor(() => expect(getMyDelegation).toHaveBeenCalledTimes(2));
    expect(result.current.data).toBeUndefined();
  });
});
