import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { QUERY_KEY } from "../query-keys";
import { useGetPositionSummary } from "./use-get-position-summary";

const getPositionSummaryByAddress = jest.fn();
const wallet = { currentChainId: "gnoland1", availNetwork: true, account: { address: "g1first" } };

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ positionRepository: { getPositionSummaryByAddress } }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({ useWallet: () => wallet }));

const summary = { stakedUsd: "15", unstakedUsd: "3", stakedCount: 1201, unstakedCount: 2 };

const renderSummary = (props: { address?: string; poolPath?: string } = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: 0 } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return {
    queryClient,
    ...renderHook(input => useGetPositionSummary(input, { refetchInterval: false }), { wrapper, initialProps: props }),
  };
};

describe("useGetPositionSummary", () => {
  beforeEach(() => {
    getPositionSummaryByAddress.mockReset();
    wallet.currentChainId = "gnoland1";
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it("keeps first-load failure unavailable and retains valid totals after a failed refresh", async () => {
    getPositionSummaryByAddress.mockRejectedValueOnce(new Error("offline"));
    const { result } = renderSummary();
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();

    getPositionSummaryByAddress.mockResolvedValueOnce(summary);
    await act(async () => {
      await result.current.refetch();
    });
    await waitFor(() => expect(result.current.data).toEqual(summary));

    getPositionSummaryByAddress.mockRejectedValueOnce(new Error("offline"));
    await act(async () => {
      await result.current.refetch();
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toEqual(summary);
  });

  it("separates address, chain and pool caches without leaking previous principal totals", async () => {
    getPositionSummaryByAddress.mockResolvedValue(summary);
    const { result, rerender } = renderSummary({ address: "g1first", poolPath: "pool-a" });
    await waitFor(() => expect(result.current.data).toEqual(summary));

    getPositionSummaryByAddress.mockRejectedValue(new Error("offline"));
    rerender({ address: "g1second", poolPath: "pool-a" });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();

    const otherPool = { ...summary, stakedUsd: "7" };
    getPositionSummaryByAddress.mockResolvedValue(otherPool);
    rerender({ address: "g1first", poolPath: "pool-b" });
    await waitFor(() => expect(result.current.data).toEqual(otherPool));

    const otherChain = { ...summary, stakedUsd: "21" };
    getPositionSummaryByAddress.mockResolvedValue(otherChain);
    wallet.currentChainId = "other-chain";
    rerender({ address: "g1first", poolPath: "pool-b" });
    await waitFor(() => expect(result.current.data).toEqual(otherChain));
  });

  it("refreshes pool-scoped totals on address-level mutation invalidation", async () => {
    getPositionSummaryByAddress.mockResolvedValue(summary);
    const { result, queryClient } = renderSummary({ address: "g1first", poolPath: "pool-a" });
    await waitFor(() => expect(result.current.data).toEqual(summary));
    const updated = { ...summary, stakedUsd: "8", unstakedUsd: "10", stakedCount: 1200, unstakedCount: 3 };
    getPositionSummaryByAddress.mockResolvedValue(updated);
    await act(async () => {
      await queryClient.invalidateQueries([QUERY_KEY.positionSummary, "gnoland1", "g1first"]);
    });
    await waitFor(() => expect(result.current.data).toEqual(updated));
  });
});
