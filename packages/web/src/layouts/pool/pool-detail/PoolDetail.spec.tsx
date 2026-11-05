import { act, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import type { ReactNode } from "react";

import { usePositionData } from "@hooks/pool/data/use-position-data";
import { PoolDetailPositionContext } from "@hooks/pool/ui/use-pool-detail-route";
import { initialPool } from "@models/pool/pool-model";
import type { PoolPositionModel } from "@models/position/pool-position-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import PoolDetail from "./PoolDetail";

const owner = "g1gdg8jjm56xnk4jckj3x9yuc3fp5zh2ekaq48ty";
let mockAsPath = "/earn/pool?positionId=25";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({
    asPath: mockAsPath,
    getPoolPath: () => "pool",
    getAddress: () => "g1gdg8jjm56xnk4jckj3x9yuc3fp5zh2ekaq48ty",
  }),
}));
jest.mock("@hooks/pool/data/use-position-data", () => ({ usePositionData: jest.fn() }));
jest.mock("@hooks/pool/data/use-position", () => ({
  usePosition: () => ({ claim: jest.fn(), claimAll: jest.fn() }),
  buildClaimAllInputFromPositions: jest.fn(),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ connected: false, account: undefined, isSwitchNetwork: false, currentChainId: "test" }),
}));
jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({ breakpoint: "web", width: 1200, handleBreakpoint: jest.fn() }),
}));
jest.mock("@hooks/common/use-video-guide", () => ({
  useVideoGuide: () => ({ isOpen: false, openVideoGuide: jest.fn(), closeVideoGuide: jest.fn() }),
}));
jest.mock("@hooks/common/use-broadcast-handler", () => ({ useBroadcastHandler: () => ({}) }));
jest.mock("@hooks/common/use-invalidate-queries", () => ({ useInvalidateQueries: () => ({}) }));
jest.mock("@hooks/common/use-message", () => ({ useMessage: () => ({}) }));
jest.mock("@hooks/common/use-transaction-confirm-modal", () => ({ useTransactionConfirmModal: () => ({}) }));
jest.mock("@hooks/common/use-transaction-event-store", () => ({ useTransactionEventStore: () => ({}) }));
jest.mock("@hooks/common/use-gnoscan-url", () => ({ useGnoscanUrl: () => ({ getAccountUrl: jest.fn() }) }));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({ tokens: [], tokenPrices: {} }),
}));
jest.mock("@query/pools", () => ({
  useGetPoolDetailByPath: () => ({ data: undefined }),
  useGetPoolStakingListByPoolPath: () => ({ data: [] }),
}));
jest.mock("@query/positions", () => ({ useGetPositionRewards: () => ({ data: undefined }) }));
jest.mock("@query/address", () => ({ useGetUsernameByAddress: () => ({ data: "" }) }));
jest.mock("@containers/header-container/HeaderContainer", () => ({ __esModule: true, default: () => null }));
jest.mock("@components/common/footer/Footer", () => ({ __esModule: true, default: () => null }));
jest.mock("@components/common/video-guide-modal/VideoGuideModal", () => ({ __esModule: true, default: () => null }));
jest.mock("./containers/pool-pair-information-container/PoolPairInformationContainer", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./containers/staking-container/StakingContainer", () => ({ __esModule: true, default: () => null }));
jest.mock("./components/my-liquidity/my-liquidity-content/MyLiquidityContent", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./components/my-liquidity/my-detailed-position-card/MyDetailedPositionCard", () => ({
  __esModule: true,
  default: ({ position }: { position: PoolPositionModel }) => (
    <>
      <div id={position.lpTokenId} />
      <article>Position {position.lpTokenId}</article>
    </>
  ),
}));

const position = (id: number, closed = false): PoolPositionModel => ({
  id,
  lpTokenId: String(id),
  poolPath: "pool",
  owner,
  staked: false,
  closed,
  tickLower: 0,
  tickUpper: 1,
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
  totalClaimedUsd: "0",
  usdValue: 0,
  tokenUri: "",
  totalDailyRewardsUsd: "0",
  stakedUsdValue: "0",
  feeTier: "FEE_3000",
  pool: initialPool,
});

function supplyPositions(open: PoolPositionModel[], closed: PoolPositionModel[] = []) {
  const all = [...closed, ...open];
  const result = (positions: PoolPositionModel[], totalPositionCount: number) => ({
    positions,
    totalPositionCount,
    loading: false,
    isFetchedPosition: true,
    refetch: jest.fn(),
    availableStake: false,
    isError: false,
    hasPositionData: true,
    isFetchingWithoutData: false,
    checkStakedPool: jest.fn(),
    getPositions: () => positions,
    isPositionDataAvailable: true,
    isLoadingPool: false,
  });
  const openPage = result(open.slice(0, 20), open.length);
  const allPage = result(all.slice(0, 20), all.length);
  const allOpen = result(open, open.length);
  const allPositions = result(all, all.length);
  jest.mocked(usePositionData).mockImplementation(options => {
    if (options?.withClosed) return options.fetchAll ? allPositions : allPage;
    return options?.fetchAll ? allOpen : openPage;
  });
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <JotaiProvider>
    <GnoswapThemeProvider>{children}</GnoswapThemeProvider>
  </JotaiProvider>
);
const scrollIntoView = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
  scrollIntoView.mockClear();
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
  mockAsPath = "/earn/pool?positionId=25";
});
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

it("keeps an open target beyond the first page visible and scrollable when there are no closed positions", () => {
  supplyPositions(Array.from({ length: 25 }, (_, index) => position(index + 1)));
  render(
    <PoolDetailPositionContext.Provider value={{ poolPath: "pool", owner, lpTokenId: "25" }}>
      <PoolDetail />
    </PoolDetailPositionContext.Provider>,
    { wrapper },
  );
  act(() => jest.runOnlyPendingTimers());

  expect(screen.getByText("Position 25")).toBeInTheDocument();
  expect(scrollIntoView.mock.contexts).toContain(document.getElementById("25"));
});

it("preserves the open-only first page and section fallback for a legacy hash outside that page", () => {
  mockAsPath = "/earn/pool?poolPath=pool#25";
  supplyPositions(
    Array.from({ length: 25 }, (_, index) => position(index + 1)),
    [position(26, true)],
  );
  render(<PoolDetail />, { wrapper });
  act(() => jest.runOnlyPendingTimers());

  expect(screen.getByText("Position 1")).toBeInTheDocument();
  expect(screen.queryByText("Position 25")).not.toBeInTheDocument();
  expect(screen.queryByText("Position 26")).not.toBeInTheDocument();
  expect(scrollIntoView.mock.contexts).toContain(document.getElementById("liquidity-wrapper"));
});

it("keeps the requested closed position visible on a position-ID link", () => {
  supplyPositions([position(1)], [position(25, true)]);
  render(
    <PoolDetailPositionContext.Provider value={{ poolPath: "pool", owner, lpTokenId: "25" }}>
      <PoolDetail />
    </PoolDetailPositionContext.Provider>,
    { wrapper },
  );
  act(() => jest.runOnlyPendingTimers());

  expect(screen.getByText("Position 25")).toBeInTheDocument();
  expect(scrollIntoView.mock.contexts).toContain(document.getElementById("25"));
});

it("scrolls to a rendered legacy hash target without enabling closed positions", () => {
  mockAsPath = "/earn/pool?poolPath=pool#1";
  supplyPositions([position(1)], [position(2, true)]);
  render(<PoolDetail />, { wrapper });
  act(() => jest.runOnlyPendingTimers());

  expect(screen.getByText("Position 1")).toBeInTheDocument();
  expect(screen.queryByText("Position 2")).not.toBeInTheDocument();
  expect(scrollIntoView.mock.contexts).toContain(document.getElementById("1"));
  expect(scrollIntoView.mock.contexts).not.toContain(document.getElementById("liquidity-wrapper"));
});
