import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

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
jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ getGnotPath: (token: TokenModel) => token }),
}));
jest.mock("@components/common/pool-graph/PoolGraph", () => ({ __esModule: true, default: () => null }));
jest.mock("./PositionHistory", () => ({ __esModule: true, default: () => null }));
jest.mock("./manage-button/ManageButton", () => ({ __esModule: true, default: () => null }));

it("shows the pool spot rate rather than the quantized current-tick rate, in either direction", () => {
  const price = 0.0000794548;
  const tokenA = { path: "a", symbol: "GNOT", displaySymbol: "GNOT", decimals: 6, priceID: "a" } as TokenModel;
  const tokenB = { path: "b", symbol: "GNS", displaySymbol: "GNS", decimals: 6, priceID: "b" } as TokenModel;
  const position = {
    id: 111,
    lpTokenId: "111",
    poolPath: "a:b:3000",
    closed: false,
    staked: false,
    liquidity: 0n,
    tokenABalance: "0",
    tokenBBalance: "0",
    positionUsdValue: "0",
    totalClaimedUsd: "0",
    rewards: [],
    claimedRewards: [],
    tickLower: -95000,
    tickUpper: -94000,
    pool: { tokenA, tokenB, price, currentTick: priceToTick(price), fee: "FEE_3000" },
  } as PoolPositionModel;

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
