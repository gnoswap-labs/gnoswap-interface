import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider as JotaiProvider } from "jotai";
import React, { ReactNode } from "react";

import MyDetailedPositionCard from "@layouts/pool/pool-detail/components/my-liquidity/my-detailed-position-card/MyDetailedPositionCard";
import { initialPool } from "@models/pool/pool-model";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { PositionRewardsResponse } from "@repositories/position/response";
import { DEVICE_TYPE } from "@styles/media";
import { QUERY_KEY } from "@query/query-keys";

import MyPositionCard from "./MyPositionCard";

const getPositionRewardsByAddressAndId = jest.fn();
const claim = jest.fn();

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ positionRepository: { getPositionRewardsByAddressAndId } }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ currentChainId: "gnoland1", availNetwork: true }),
}));
jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({ push: jest.fn(), asPath: "/earn/pool" }),
}));
jest.mock("@hooks/common/use-prefetch-navigation", () => ({
  usePrefetchNavigation: () => ({ prefetch: jest.fn() }),
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
jest.mock("@layouts/pool/pool-detail/components/my-liquidity/my-detailed-position-card/PositionHistory", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock(
  "@layouts/pool/pool-detail/components/my-liquidity/my-detailed-position-card/manage-button/ManageButton",
  () => ({
    __esModule: true,
    default: () => null,
  }),
);

const usdc: TokenModel = {
  path: "gno.land/r/demo/usdc",
  priceID: "USDC",
  type: "GRC20",
  chainId: "gnoland1",
  createdAt: "",
  name: "USDC",
  symbol: "USDC",
  displaySymbol: "USDC",
  logoURI: "",
  decimals: 6,
};
const atom: TokenModel = {
  ...usdc,
  path: "gno.land/r/demo/atom",
  priceID: "ATOM",
  symbol: "ATOM",
  displaySymbol: "ATOM",
  decimals: 18,
};
const rewards: PositionRewardsResponse = {
  claimed: {
    swapFee: [
      { tokenPath: usdc.path, amount: "123456789", usdValue: "10" },
      { tokenPath: atom.path, amount: "1230000000000000000", usdValue: "2" },
    ],
    internalReward: [{ tokenPath: usdc.path, amount: "4000000", usdValue: "5" }],
    externalReward: [{ tokenPath: "gno.land/r/demo/delisted", amount: "9000000", usdValue: "7" }],
  },
  claimable: { swapFee: [], internalReward: [], externalReward: [] },
  positionsWithSwapFee: [],
  positionsWithStakingReward: [],
  totalUsd: {
    claimed: { swapFee: "12", internalReward: "5", externalReward: "7", total: "24" },
    claimable: { swapFee: "0", internalReward: "0", externalReward: "0", total: "0" },
  },
};
const position: PoolPositionModel = {
  id: 42,
  lpTokenId: "42",
  poolPath: "pool",
  owner: "g1currentowner",
  staked: false,
  closed: false,
  tickLower: -100,
  tickUpper: 100,
  liquidity: 0n,
  tokenABalance: "0",
  tokenBBalance: "0",
  positionUsdValue: "50",
  unclaimedFeeAAmount: "0",
  unclaimedFeeBAmount: "0",
  apr: "1",
  stakedAt: "",
  rewards: [
    {
      rewardToken: { ...usdc, rewardType: "SWAP_FEE" },
      totalAmount: "7",
      claimableAmount: "7",
      claimableUsd: "7",
      apr: null,
    },
  ],
  claimedRewards: [{ rewardType: "SWAP_FEE", rewardToken: { ...usdc, rewardType: "SWAP_FEE" }, claimedAmount: "999" }],
  totalClaimedUsd: "24",
  usdValue: 50,
  tokenUri: "",
  totalDailyRewardsUsd: "0",
  stakedUsdValue: "0",
  feeTier: "FEE_3000",
  pool: { ...initialPool, tokenA: usdc, tokenB: atom, price: 1, currentTick: 0, fee: "FEE_3000" },
};

type Variant = "detailed" | "common";
const renderCard = (variant: Variant, closed = false, empty = false) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <GnoswapThemeProvider>{children}</GnoswapThemeProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
  const card = (address = "g1pastrecipient", id = "42", price = "1000", total = "24") => {
    const scopedPosition = {
      ...position,
      closed,
      id: Number(id),
      lpTokenId: id,
      totalClaimedUsd: empty ? "0" : total,
      claimedRewards: empty ? [] : position.claimedRewards,
    };
    return variant === "detailed" ? (
      <MyDetailedPositionCard
        position={{ ...scopedPosition, rawPosition: scopedPosition }}
        address={address}
        isStakable={false}
        breakpoint={DEVICE_TYPE.WEB}
        loading={false}
        isHiddenAddPosition
        connected={false}
        tokenPrices={{ USDC: { usd: price }, ATOM: { usd: price } } as unknown as Record<string, TokenPriceModel>}
        isOwnerAddress={false}
        claim={claim}
      />
    ) : (
      <MyPositionCard
        position={scopedPosition}
        address={address}
        movePoolDetail={jest.fn()}
        mobile={false}
        themeKey="light"
      />
    );
  };
  const rendered = render(card(), { wrapper });
  return {
    ...rendered,
    queryClient,
    rerenderCard: (address = "g1pastrecipient", id = "42", price = "1000", total = "24") =>
      rendered.rerender(card(address, id, price, total)),
    claimedRegion: () => {
      const label = screen.getByText(
        variant === "detailed" ? "Pool:position.card.claimedReward.title" : "Earn:positions.card.claimedRewards",
      );
      return variant === "detailed" ? label.parentElement! : (label.parentElement!.nextElementSibling as HTMLElement);
    },
  };
};

describe.each<Variant>(["detailed", "common"])("%s position claimed rewards", variant => {
  beforeEach(() => {
    getPositionRewardsByAddressAndId.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it.each([false, true])("uses the list total, fetching captured token USD only on hover (closed=%s)", async closed => {
    getPositionRewardsByAddressAndId.mockResolvedValue(rewards);
    const { claimedRegion, rerenderCard } = renderCard(variant, closed);

    expect(within(claimedRegion()).getByText("$24")).toBeInTheDocument();
    expect(getPositionRewardsByAddressAndId).not.toHaveBeenCalled();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await userEvent.hover(within(claimedRegion()).getByText("$24"));
    const tooltip = await screen.findByRole("tooltip");
    await waitFor(() => expect(tooltip).toHaveTextContent("$12"));
    expect(getPositionRewardsByAddressAndId).toHaveBeenCalledWith("g1pastrecipient", "42");
    expect(tooltip).toHaveTextContent("$5");
    expect(tooltip).toHaveTextContent("$7");
    expect(within(tooltip).getByText("123.456789")).toBeInTheDocument();
    expect(within(tooltip).getByText("1.23")).toBeInTheDocument();
    expect(within(tooltip).getByText("delisted")).toBeInTheDocument();

    rerenderCard("g1pastrecipient", "42", "9000");
    expect(within(claimedRegion()).getByText("$24")).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("$12");
    expect(getPositionRewardsByAddressAndId).toHaveBeenCalledTimes(1);
  });

  it("loads details on keyboard focus and refreshes an open tooltip after claim/remove invalidation", async () => {
    getPositionRewardsByAddressAndId.mockResolvedValue(rewards);
    const { claimedRegion, queryClient } = renderCard(variant);
    fireEvent.focus(within(claimedRegion()).getByText("$24"));
    const tooltip = await screen.findByRole("tooltip");
    await waitFor(() => expect(tooltip).toHaveTextContent("$12"));
    getPositionRewardsByAddressAndId.mockResolvedValue({
      ...rewards,
      claimed: { ...rewards.claimed, swapFee: [{ tokenPath: usdc.path, amount: "2000000", usdValue: "18" }] },
    });
    await act(async () => {
      await queryClient.invalidateQueries([QUERY_KEY.positionRewards, "gnoland1", "g1pastrecipient"]);
    });
    await waitFor(() => expect(tooltip).toHaveTextContent("$18"));
    expect(within(claimedRegion()).getByText("$24")).toBeInTheDocument();
  });

  it.each(["recipient", "position"])(
    "never exposes another %s's token history while details load or fail",
    async scope => {
      getPositionRewardsByAddressAndId.mockResolvedValueOnce(rewards);
      const { claimedRegion, rerenderCard } = renderCard(variant);
      await userEvent.hover(within(claimedRegion()).getByText("$24"));
      await waitFor(() => expect(screen.getByRole("tooltip")).toHaveTextContent("123.456789"));

      getPositionRewardsByAddressAndId.mockRejectedValue(new Error("history offline"));
      rerenderCard(
        scope === "recipient" ? "g1another" : "g1pastrecipient",
        scope === "position" ? "43" : "42",
        "1000",
        "31",
      );
      expect(within(claimedRegion()).getByText("$31")).toBeInTheDocument();
      expect(screen.getByRole("tooltip")).not.toHaveTextContent("123.456789");
      await waitFor(() => expect(screen.getByRole("tooltip")).toHaveTextContent("-"));
      expect(screen.getByRole("tooltip")).not.toHaveTextContent("$0");
    },
  );

  it("keeps the known list total when the detail lookup fails, rather than inventing zero", async () => {
    getPositionRewardsByAddressAndId.mockRejectedValue(new Error("history offline"));
    const { claimedRegion } = renderCard(variant);
    await userEvent.hover(within(claimedRegion()).getByText("$24"));
    await waitFor(() => expect(screen.getByRole("tooltip")).toHaveTextContent("-"));
    expect(within(claimedRegion()).getByText("$24")).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).not.toHaveTextContent("$0");
  });

  it("shows a successful empty list total without making a details request", () => {
    const { claimedRegion } = renderCard(variant, false, true);
    expect(within(claimedRegion()).getByText("$0")).toBeInTheDocument();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(getPositionRewardsByAddressAndId).not.toHaveBeenCalled();
  });

  it("does not request per-card details on remount or with elapsed polling intervals", async () => {
    const { claimedRegion, unmount } = renderCard(variant);
    expect(within(claimedRegion()).getByText("$24")).toBeInTheDocument();
    unmount();
    renderCard(variant);
    jest.useFakeTimers();
    try {
      await act(async () => {
        jest.advanceTimersByTime(3 * 60_000);
      });
      expect(getPositionRewardsByAddressAndId).not.toHaveBeenCalled();
    } finally {
      jest.useRealTimers();
    }
  });
});
