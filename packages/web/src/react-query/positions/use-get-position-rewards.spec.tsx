import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { PositionRewardsResponse } from "@repositories/position/response";

import { QUERY_KEY } from "../query-keys";
import { useGetPositionRewards } from "./use-get-position-rewards";

const getPositionRewardsByAddress = jest.fn();
const wallet = { currentChainId: "gnoland1", availNetwork: true };

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ positionRepository: { getPositionRewardsByAddress } }),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => wallet,
}));

const address = "g1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const rewards: PositionRewardsResponse = {
  claimed: { swapFee: [], internalReward: [], externalReward: [] },
  claimable: { swapFee: [], internalReward: [], externalReward: [] },
  positionsWithSwapFee: [],
  positionsWithStakingReward: [],
  totalUsd: {
    claimable: { swapFee: "7", internalReward: "0", externalReward: "0", total: "7" },
    claimed: { swapFee: "3", internalReward: "0", externalReward: "0", total: "3" },
  },
};

const renderRewards = (props: { address: string; poolPath?: string } = { address }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return {
    queryClient,
    ...renderHook(input => useGetPositionRewards(input, { refetchInterval: false }), {
      wrapper,
      initialProps: props,
    }),
  };
};

describe("useGetPositionRewards", () => {
  beforeEach(() => {
    getPositionRewardsByAddress.mockReset();
    wallet.currentChainId = "gnoland1";
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

  it.each(["address", "poolPath", "chain"])("does not show another scope's claims while %s loads", async scope => {
    getPositionRewardsByAddress.mockResolvedValueOnce(rewards);
    const initialProps = { address, poolPath: "pool-first" };
    const { result, rerender } = renderRewards(initialProps);
    await waitFor(() => expect(result.current.data).toEqual(rewards));

    getPositionRewardsByAddress.mockReturnValue(new Promise(() => {}));
    if (scope === "chain") wallet.currentChainId = "another-chain";
    rerender({
      address: scope === "address" ? "g1another" : address,
      poolPath: scope === "poolPath" ? "pool-second" : "pool-first",
    });

    await waitFor(() => expect(result.current.isInitialLoading).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it("refreshes the portfolio and each pool scope after an address-level claim invalidation", async () => {
    getPositionRewardsByAddress.mockResolvedValue(rewards);
    const { result, queryClient } = renderRewards({ address, poolPath: "pool-first" });
    await waitFor(() => expect(result.current.data).toEqual(rewards));
    queryClient.setQueryData([QUERY_KEY.positionRewards, "gnoland1", address, ""], rewards);
    queryClient.setQueryData([QUERY_KEY.positionRewards, "gnoland1", address, "pool-second"], rewards);

    const updated = { ...rewards, totalUsd: { ...rewards.totalUsd, claimed: { ...rewards.totalUsd.claimed, total: "9" } } };
    getPositionRewardsByAddress.mockResolvedValue(updated);
    await act(async () => {
      await queryClient.invalidateQueries([QUERY_KEY.positionRewards, "gnoland1", address]);
    });

    await waitFor(() => expect(result.current.data).toEqual(updated));
    expect(queryClient.getQueryState([QUERY_KEY.positionRewards, "gnoland1", address, ""])?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState([QUERY_KEY.positionRewards, "gnoland1", address, "pool-second"])?.isInvalidated).toBe(true);
  });
});
