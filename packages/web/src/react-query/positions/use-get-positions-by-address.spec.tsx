import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { GetPositionsByAddressResult } from "@repositories/position/response";

import { useGetPositionsByAddress } from "./use-get-positions-by-address";

const getPositionsByAddress = jest.fn();
const wallet = { currentChainId: "gnoland1", availNetwork: true };

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ positionRepository: { getPositionsByAddress } }),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => wallet,
}));

const address = "g1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

const renderPositions = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(viewedAddress => useGetPositionsByAddress({ address: viewedAddress }, { refetchInterval: false }), {
    wrapper,
    initialProps: address,
  });
};

describe("useGetPositionsByAddress", () => {
  beforeEach(() => {
    getPositionsByAddress.mockReset();
    wallet.currentChainId = "gnoland1";
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("reports an initial request failure instead of claiming the address has no positions", async () => {
    const error = new Error("connection failed");
    getPositionsByAddress.mockRejectedValue(error);
    jest.spyOn(console, "error").mockImplementation(() => undefined);

    const { result } = renderPositions();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith("Failed to fetch positions:", error);
  });

  it("keeps a loaded result when a background refresh fails", async () => {
    const loaded = { positions: [{ id: 42 }], totalCount: 1 } as GetPositionsByAddressResult;
    getPositionsByAddress.mockResolvedValueOnce(loaded).mockRejectedValueOnce(new Error("connection failed"));

    const { result } = renderPositions();
    await waitFor(() => expect(result.current.data).toEqual(loaded));
    expect(result.current.isError).toBe(false);

    await act(async () => {
      await result.current.refetch();
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isRefetchError).toBe(true);
    expect(result.current.data).toEqual(loaded);
  });

  it.each(["recipient", "chain"])(
    "does not show another %s's list totals while its replacement loads or fails",
    async scope => {
      const loaded = {
        positions: [{ id: 42, totalClaimedUsd: "24" }],
        totalCount: 1,
      } as GetPositionsByAddressResult;
      getPositionsByAddress.mockResolvedValueOnce(loaded);
      const { result, rerender } = renderPositions();
      await waitFor(() => expect(result.current.data?.positions[0].totalClaimedUsd).toBe("24"));
      const pendingLookup = Promise.withResolvers<GetPositionsByAddressResult>();
      getPositionsByAddress.mockReturnValue(pendingLookup.promise);
      if (scope === "chain") wallet.currentChainId = "another-chain";
      rerender(scope === "recipient" ? "g1another" : address);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isInitialLoading).toBe(true);
      jest.spyOn(console, "error").mockImplementation(() => undefined);
      await act(async () => {
        pendingLookup.reject(new Error("history offline"));
      });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.data).toBeUndefined();
    },
  );
});
