import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";

import { initialPool } from "@models/pool/pool-model";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { IncreaseState } from "@states/index";
import { usePositionData } from "./use-position-data";
import { useDecreaseHandle } from "./use-decrease-handle";

jest.mock("@states/index", () => {
  const { atom } = jest.requireActual("jotai");
  return { IncreaseState: { selectedPosition: atom(null) } };
});
jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({ getPoolPath: () => "token-a:token-b:3000", getPositionId: () => "1" }),
}));
jest.mock("./use-position-data", () => ({ usePositionData: jest.fn() }));
jest.mock("./use-select-pool", () => ({
  useSelectPool: () => ({ depositRatio: null, feeBoost: null }),
}));
jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ getGnotPath: (token: unknown) => token }),
}));
jest.mock("@hooks/token/data/use-token-amount-input", () => ({
  useTokenAmountInput: () => ({ amount: "0" }),
}));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({ tokenPrices: { "token-a": { usd: "0.0588" }, "token-b": { usd: "2" } } }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ connected: true, account: { address: "g1owner" }, loadingConnect: "done" }),
}));

const position: PoolPositionModel = {
  id: 1,
  lpTokenId: "1",
  poolPath: "token-a:token-b:3000",
  feeTier: "FEE_3000",
  staked: false,
  owner: "g1owner",
  tickLower: -100,
  tickUpper: 100,
  liquidity: 10000000000000n,
  tokenABalance: "196678919822",
  tokenBBalance: "813141175833",
  positionUsdValue: "0",
  unclaimedFeeAAmount: "1000000",
  unclaimedFeeBAmount: "2000000",
  apr: "0",
  stakedAt: "",
  rewards: [],
  claimedRewards: [],
  closed: false,
  totalClaimedUsd: "0",
  usdValue: 0,
  tokenUri: "",
  totalDailyRewardsUsd: "0",
  stakedUsdValue: "0",
  pool: {
    ...initialPool,
    fee: "3000",
    tokenA: { ...initialPool.tokenA, path: "token-a", priceID: "token-a", decimals: 6 },
    tokenB: { ...initialPool.tokenB, path: "token-b", priceID: "token-b", decimals: 6 },
  },
};

function renderDecrease(selected: PoolPositionModel, prefilled: boolean) {
  const store = createStore();
  if (prefilled) store.set(IncreaseState.selectedPosition, selected);
  (usePositionData as jest.Mock).mockReturnValue({ positions: [selected], refetch: jest.fn() });
  const hook = renderHook(useDecreaseHandle, {
    wrapper: ({ children }: React.PropsWithChildren) => <Provider store={store}>{children}</Provider>,
  });
  return { ...hook, store };
}

describe("decrease position balance units", () => {
  it.each([
    { source: "a query-loaded position", prefilled: false },
    { source: "the selected-position state", prefilled: true },
  ])("normalizes raw balances and USD from $source", ({ prefilled }) => {
    const { result, store } = renderDecrease(position, prefilled);
    expect(store.get(IncreaseState.selectedPosition)).toBe(position);
    expect(store.get(IncreaseState.selectedPosition)).toMatchObject({
      tokenABalance: "196678919822",
      tokenBBalance: "813141175833",
    });
    expect(result.current.pooledTokenInfos).toMatchObject({
      tokenABalance: "196678.919822",
      tokenBBalance: "813141.175833",
      tokenARemainingAmount: "98339.459911",
      tokenBRemainingAmount: "406570.5879165",
      poolAmountUSDA: "$5,782.36",
      poolAmountUSDB: "$813,141.17",
      unClaimTokenAAmount: "1",
      unClaimTokenBAmount: "2",
    });
    expect(position.tokenABalance).toBe("196678919822");
    expect(position.tokenBBalance).toBe("813141175833");
  });

  it("uses each token's decimals and recomputes remaining balances when the withdrawal percentage changes", () => {
    const mixedDecimals = {
      ...position,
      tokenBBalance: "1234567890000000000",
      pool: { ...position.pool, tokenB: { ...position.pool.tokenB, decimals: 18 } },
    };
    const { result } = renderDecrease(mixedDecimals, false);
    expect(result.current.pooledTokenInfos?.tokenBBalance).toBe("1.23456789");
    expect(result.current.pooledTokenInfos?.tokenBRemainingAmount).toBe("0.617283945");
    expect(result.current.pooledTokenInfos?.poolAmountUSDB).toBe("$1.23");

    act(() => result.current.setPercent(25));
    expect(result.current.pooledTokenInfos?.tokenARemainingAmount).toBe("147509.1898665");
    expect(result.current.pooledTokenInfos?.tokenBRemainingAmount).toBe("0.9259259175");

    act(() => result.current.setPercent(100));
    expect(result.current.pooledTokenInfos?.tokenARemainingAmount).toBe("0");
    expect(result.current.pooledTokenInfos?.tokenBRemainingAmount).toBe("0");
  });
});
