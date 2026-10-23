import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { initialPool } from "@models/pool/pool-model";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";
import { priceToTick } from "@utils/swap-utils";

import MyDetailedPositionCard from "./MyDetailedPositionCard";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({ push: jest.fn() }),
}));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({}),
}));
jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({ width: 1200, handleBreakpoint: jest.fn() }),
}));
jest.mock("@hooks/pool/data/use-pool-liquidity-segments-by-path", () => ({
  usePoolLiquiditySegmentsByPath: () => ({ liquiditySegments: [], isLoading: true }),
}));
jest.mock("@query/positions/use-get-position-rewards-by-id", () => ({
  useGetPositionRewardsById: () => ({ data: undefined, isInitialLoading: false }),
}));
jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ getGnotPath: (token: TokenModel) => token }),
}));
jest.mock("@components/common/pool-graph/PoolGraph", () => ({ __esModule: true, default: () => null }));
jest.mock("./PositionHistory", () => ({ __esModule: true, default: () => null }));
jest.mock("./manage-button/ManageButton", () => ({ __esModule: true, default: () => null }));

it("shows the pool spot rate rather than the quantized current-tick rate, in either direction", () => {
  const price = 0.0000794548;
  const tokenA: TokenModel = {
    path: "a",
    type: "GRC20",
    chainId: "gno.land",
    name: "GNOT",
    symbol: "GNOT",
    displaySymbol: "GNOT",
    decimals: 6,
    logoURI: "",
    createdAt: "",
    priceID: "a",
  };
  const tokenB: TokenModel = {
    path: "b",
    type: "GRC20",
    chainId: "gno.land",
    name: "GNS",
    symbol: "GNS",
    displaySymbol: "GNS",
    decimals: 6,
    logoURI: "",
    createdAt: "",
    priceID: "b",
  };
  const position: PoolPositionModel = {
    id: 111,
    lpTokenId: "111",
    poolPath: "a:b:3000",
    staked: false,
    owner: "",
    tickLower: -95000,
    tickUpper: -94000,
    liquidity: 0n,
    tokenABalance: "0",
    tokenBBalance: "0",
    positionUsdValue: "0",
    unclaimedFeeAAmount: "0",
    unclaimedFeeBAmount: "0",
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
    feeTier: "FEE_3000",
    pool: {
      ...initialPool,
      poolPath: "a:b:3000",
      tokenA,
      tokenB,
      price,
      currentTick: priceToTick(price),
    },
  };

  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <MyDetailedPositionCard
          position={position}
          isStakable={false}
          breakpoint={DEVICE_TYPE.WEB}
          loading={false}
          address=""
          isHiddenAddPosition={false}
          connected={false}
          tokenPrices={{}}
          isOwnerAddress={false}
          claim={jest.fn()}
        />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

  expect(screen.getByText(/1 GNOT = 0\.0000794548 GNS/)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/1 GNOT = 0\.0000794548 GNS/).parentElement!.querySelector(".icon-wrapper")!);
  expect(screen.getByText(/1 GNS = 12\.58K GNOT/)).toBeInTheDocument();
});
