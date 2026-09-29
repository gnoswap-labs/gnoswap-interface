import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { PositionRewardsResponse } from "@repositories/position/response";

import { useGetPositionRewards } from "./use-get-position-rewards";

const getPositionRewardsByAddress = jest.fn();

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ positionRepository: { getPositionRewardsByAddress } }),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ currentChainId: "gnoland1", availNetwork: true }),
}));

const address = "g1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

const renderRewards = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useGetPositionRewards({ address }, { refetchInterval: false }), { wrapper });
};

describe("useGetPositionRewards", () => {
  beforeEach(() => {
    getPositionRewardsByAddress.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it("leaves rewards unavailable after the first request fails", async () => {
    getPositionRewardsByAddress.mockRejectedValue(new Error("connection failed"));
    const { result } = renderRewards();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it("retains previously loaded rewards when a refresh fails", async () => {
    const rewards = {
      totalUsd: { claimable: { total: "7" }, claimed: { total: "3" } },
    } as PositionRewardsResponse;
    getPositionRewardsByAddress.mockResolvedValueOnce(rewards).mockRejectedValueOnce(new Error("connection failed"));
    const { result } = renderRewards();
    await waitFor(() => expect(result.current.data).toEqual(rewards));

    let refreshStatus: string | undefined;
    await act(async () => {
      refreshStatus = (await result.current.refetch()).status;
    });
    expect(getPositionRewardsByAddress).toHaveBeenCalledTimes(2);
    expect(refreshStatus).toBe("error");
    expect(result.current.data).toEqual(rewards);
  });
});
