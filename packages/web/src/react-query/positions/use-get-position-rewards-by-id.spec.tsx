import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { PositionRewardsResponse } from "@repositories/position/response";

import { QUERY_KEY } from "../query-keys";
import { useGetPositionRewardsById } from "./use-get-position-rewards-by-id";

const getPositionRewardsByAddressAndId = jest.fn();
const wallet = { currentChainId: "gnoland1", availNetwork: true, account: { address: "g1connected" } };

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ positionRepository: { getPositionRewardsByAddressAndId } }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({ useWallet: () => wallet }));

const rewards: PositionRewardsResponse = {
  claimed: {
    swapFee: [{ tokenPath: "gno.land/r/demo/usdc", amount: "123456789", usdValue: "10" }],
    internalReward: [],
    externalReward: [],
  },
  claimable: { swapFee: [], internalReward: [], externalReward: [] },
  positionsWithSwapFee: [],
  positionsWithStakingReward: [],
  totalUsd: {
    claimed: { swapFee: "10", internalReward: "0", externalReward: "0", total: "10" },
    claimable: { swapFee: "0", internalReward: "0", externalReward: "0", total: "0" },
  },
};

const renderRewards = (props = { address: "g1recipient", positionId: "42" }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, keepPreviousData: true } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return {
    queryClient,
    ...renderHook(input => useGetPositionRewardsById(input), {
      wrapper,
      initialProps: props,
    }),
  };
};

describe("useGetPositionRewardsById", () => {
  beforeEach(() => {
    getPositionRewardsByAddressAndId.mockReset();
    wallet.currentChainId = "gnoland1";
    wallet.availNetwork = true;
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it("fetches the viewed recipient rather than substituting the connected owner", async () => {
    getPositionRewardsByAddressAndId.mockResolvedValue(rewards);
    const { result } = renderRewards();

    await waitFor(() => expect(result.current.data?.totalUsd.claimed.total).toBe("10"));
    expect(getPositionRewardsByAddressAndId).toHaveBeenCalledWith("g1recipient", "42");
    expect(result.current.data?.claimed.swapFee[0].amount).toBe("123456789");
  });

  it.each(["address", "positionId", "chain"])(
    "does not retain another scope's history when %s changes",
    async scope => {
      getPositionRewardsByAddressAndId.mockResolvedValueOnce(rewards);
      const { result, rerender } = renderRewards();
      await waitFor(() => expect(result.current.data).toEqual(rewards));

      getPositionRewardsByAddressAndId.mockReturnValue(new Promise(() => {}));
      if (scope === "chain") wallet.currentChainId = "another-chain";
      rerender({
        address: scope === "address" ? "g1another" : "g1recipient",
        positionId: scope === "positionId" ? "43" : "42",
      });

      await waitFor(() => expect(result.current.isInitialLoading).toBe(true));
      expect(result.current.data).toBeUndefined();
    },
  );

  it("refreshes position histories with the existing address-level claim invalidation", async () => {
    getPositionRewardsByAddressAndId.mockResolvedValue(rewards);
    const { result, queryClient } = renderRewards();
    await waitFor(() => expect(result.current.data).toEqual(rewards));
    const secondPositionKey = [QUERY_KEY.positionRewards, "gnoland1", "g1recipient", "position", "43"];
    queryClient.setQueryData(secondPositionKey, rewards);
    const updated = {
      ...rewards,
      totalUsd: { ...rewards.totalUsd, claimed: { ...rewards.totalUsd.claimed, total: "17" } },
    };
    getPositionRewardsByAddressAndId.mockResolvedValue(updated);

    await act(async () => {
      await queryClient.invalidateQueries([QUERY_KEY.positionRewards, "gnoland1", "g1recipient"]);
    });

    await waitFor(() => expect(result.current.data?.totalUsd.claimed.total).toBe("17"));
    expect(queryClient.getQueryState(secondPositionKey)?.isInvalidated).toBe(true);
  });

  it("reuses fresh history on remount and never polls while mounted", async () => {
    getPositionRewardsByAddressAndId.mockResolvedValue(rewards);
    const { result, queryClient, unmount } = renderRewards();
    await waitFor(() => expect(result.current.data).toEqual(rewards));
    unmount();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const remounted = renderHook(() => useGetPositionRewardsById({ address: "g1recipient", positionId: "42" }), {
      wrapper,
    });
    expect(remounted.result.current.data).toEqual(rewards);
    expect(getPositionRewardsByAddressAndId).toHaveBeenCalledTimes(1);

    jest.useFakeTimers();
    try {
      await act(async () => {
        jest.advanceTimersByTime(10 * 60_000);
      });
      expect(getPositionRewardsByAddressAndId).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it("defers invalidated closed-tooltip history until it is needed again", async () => {
    getPositionRewardsByAddressAndId.mockResolvedValue(rewards);
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result, rerender } = renderHook(
      enabled => useGetPositionRewardsById({ address: "g1recipient", positionId: "42" }, { enabled }),
      { wrapper, initialProps: false },
    );
    expect(getPositionRewardsByAddressAndId).not.toHaveBeenCalled();
    rerender(true);
    await waitFor(() => expect(result.current.data).toEqual(rewards));
    rerender(false);
    await act(async () => {
      await queryClient.invalidateQueries([QUERY_KEY.positionRewards, "gnoland1", "g1recipient"]);
    });
    expect(getPositionRewardsByAddressAndId).toHaveBeenCalledTimes(1);
    const updated = {
      ...rewards,
      totalUsd: { ...rewards.totalUsd, claimed: { ...rewards.totalUsd.claimed, total: "17" } },
    };
    getPositionRewardsByAddressAndId.mockResolvedValue(updated);
    rerender(true);
    await waitFor(() => expect(result.current.data?.totalUsd.claimed.total).toBe("17"));
    expect(getPositionRewardsByAddressAndId).toHaveBeenCalledTimes(2);
  });

  it("leaves failed history unavailable, rather than pretending nothing was claimed", async () => {
    getPositionRewardsByAddressAndId.mockRejectedValue(new Error("history offline"));
    const { result } = renderRewards();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it.each(["address", "network"])("does not fetch without the required %s", missing => {
    if (missing === "network") wallet.availNetwork = false;
    const { result } = renderRewards({ address: missing === "address" ? "" : "g1recipient", positionId: "42" });

    expect(result.current.fetchStatus).toBe("idle");
    expect(getPositionRewardsByAddressAndId).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });
});
