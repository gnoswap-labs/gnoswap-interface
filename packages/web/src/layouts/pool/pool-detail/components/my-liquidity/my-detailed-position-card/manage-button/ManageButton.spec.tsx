import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";

import { REPOSITION_ENABLED } from "@constants/environment.constant";
import { useDecreaseHandle } from "@hooks/pool/data/use-decrease-handle";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { initialPool } from "@models/pool/pool-model";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { PositionConverter } from "@services/converters/position";
import { IncreaseState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";
import MyDetailedPositionCard from "../MyDetailedPositionCard";
import { POSITION_ACTION } from "./types";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({
    push: jest.fn(),
    movePageWithPositionId: jest.fn(),
    getPoolPath: () => "token-a:token-b:3000",
    getPositionId: () => "1",
  }),
}));
jest.mock("@hooks/common/use-gnoswap-context", () => ({ useGnoswapContext: () => ({}) }));
jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({ width: 1200, handleBreakpoint: jest.fn() }),
}));
jest.mock("@hooks/pool/data/use-pool-liquidity-segments-by-path", () => ({
  usePoolLiquiditySegmentsByPath: () => ({ liquiditySegments: [], isLoading: true }),
}));
jest.mock("@hooks/pool/data/use-position-data", () => ({ usePositionData: jest.fn() }));
jest.mock("@query/positions/use-get-position-rewards-by-id", () => ({
  useGetPositionRewardsById: () => ({ data: undefined, isInitialLoading: false }),
}));
jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ getGnotPath: (token: TokenModel) => token }),
}));
jest.mock("@hooks/pool/data/use-select-pool", () => ({
  useSelectPool: () => ({ depositRatio: null, feeBoost: null }),
}));
jest.mock("@hooks/token/data/use-token-amount-input", () => ({
  useTokenAmountInput: () => ({ amount: "0", changeAmount: jest.fn() }),
}));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({ tokenPrices: { "token-a": { usd: "0.0588" }, "token-b": { usd: "2" } } }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ connected: true, account: { address: "g1owner" }, loadingConnect: "done" }),
}));
jest.mock("@components/common/pool-graph/PoolGraph", () => ({ __esModule: true, default: () => null }));
jest.mock("../PositionHistory", () => ({ __esModule: true, default: () => null }));

const rawPosition: PoolPositionModel = {
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
    poolPath: "token-a:token-b:3000",
    fee: "3000",
    tokenA: { ...initialPool.tokenA, path: "token-a", priceID: "token-a", decimals: 6 },
    tokenB: { ...initialPool.tokenB, path: "token-b", priceID: "token-b", decimals: 6 },
  },
};

it("keeps the card's selected decrease position raw and normalizes its balances once", () => {
  const store = createStore();
  const displayPosition = PositionConverter.convertPositions([rawPosition])[0];
  (usePositionData as jest.Mock).mockReturnValue({ positions: [rawPosition], refetch: jest.fn() });

  expect(displayPosition.tokenABalance).toBe("196678.919822");
  expect(displayPosition.tokenBBalance).toBe("813141.175833");
  expect(displayPosition.rawPosition).toBe(rawPosition);

  render(
    <Provider store={store}>
      <GnoswapThemeProvider>
        <MyDetailedPositionCard
          position={displayPosition}
          isStakable={false}
          breakpoint={DEVICE_TYPE.WEB}
          loading={false}
          address="g1owner"
          isHiddenAddPosition={false}
          connected={true}
          tokenPrices={{}}
          isOwnerAddress={true}
          claim={jest.fn()}
        />
      </GnoswapThemeProvider>
    </Provider>,
  );

  fireEvent.click(screen.getByText("Pool:position.card.btn.manage.label"));
  fireEvent.click(screen.getByText("Pool:position.card.btn.manage.decrease"));

  const selectedPosition = store.get(IncreaseState.selectedPosition);
  expect(selectedPosition).toBe(rawPosition);
  expect(selectedPosition).toMatchObject({
    tokenABalance: "196678919822",
    tokenBBalance: "813141175833",
  });

  const { result } = renderHook(useDecreaseHandle, {
    wrapper: ({ children }: React.PropsWithChildren) => <Provider store={store}>{children}</Provider>,
  });

  expect(result.current.pooledTokenInfos).toMatchObject({
    tokenABalance: "196678.919822",
    tokenBBalance: "813141.175833",
    tokenARemainingAmount: "98339.459911",
    tokenBRemainingAmount: "406570.5879165",
    poolAmountUSDA: "$5,782.36",
    poolAmountUSDB: "$813,141.17",
  });
  const otherActions = [...(REPOSITION_ENABLED ? [POSITION_ACTION.REPOSITION] : []), POSITION_ACTION.INCREASE];
  otherActions.forEach(action => {
    fireEvent.click(screen.getByText("Pool:position.card.btn.manage.label"));
    fireEvent.click(screen.getByText(action));
    expect(store.get(IncreaseState.selectedPosition)).toBe(rawPosition);
  });
  expect(rawPosition.tokenABalance).toBe("196678919822");
  expect(rawPosition.tokenBBalance).toBe("813141175833");
});
