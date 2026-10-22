import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
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
jest.mock("@layouts/pool/pool-detail/components/my-liquidity/my-detailed-position-card/manage-button/ManageButton", () => ({
  __esModule: true,
  default: () => null,
}));
// Inspect the real tooltip content without relying on jsdom floating-element positioning.
jest.mock("@components/common/tooltip/Tooltip", () => ({
  __esModule: true,
  default: ({
    children,
    FloatingContent,
    forcedClose,
  }: {
    children: ReactNode;
    FloatingContent: ReactNode;
    forcedClose?: boolean;
  }) => (
    <>
      {children}
      {!forcedClose && <div role="tooltip">{FloatingContent}</div>}
    </>
  ),
}));

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
const atom: TokenModel = { ...usdc, path: "gno.land/r/demo/atom", priceID: "ATOM", symbol: "ATOM", displaySymbol: "ATOM", decimals: 18 };
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
  rewards: [{ rewardToken: { ...usdc, rewardType: "SWAP_FEE" }, totalAmount: "7", claimableAmount: "7", claimableUsd: "7", apr: null }],
  claimedRewards: [{ rewardType: "SWAP_FEE", rewardToken: { ...usdc, rewardType: "SWAP_FEE" }, claimedAmount: "999" }],
  totalClaimedUsd: "999",
  usdValue: 50,
  tokenUri: "",
  totalDailyRewardsUsd: "0",
  stakedUsdValue: "0",
  feeTier: "FEE_3000",
  pool: { ...initialPool, tokenA: usdc, tokenB: atom, price: 1, currentTick: 0, fee: "FEE_3000" },
};

type Variant = "detailed" | "common";
const renderCard = (variant: Variant, closed = false) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <GnoswapThemeProvider>{children}</GnoswapThemeProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
  const card = (address = "g1pastrecipient", id = "42", price = "1000") => {
    const scopedPosition = { ...position, closed, id: Number(id), lpTokenId: id };
    return variant === "detailed" ? (
      <MyDetailedPositionCard
        position={scopedPosition}
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
      <MyPositionCard position={scopedPosition} address={address} movePoolDetail={jest.fn()} mobile={false} themeKey="light" />
    );
  };
  const rendered = render(card(), { wrapper });
  return {
    ...rendered,
    rerenderCard: (address = "g1pastrecipient", id = "42", price = "1000") => rendered.rerender(card(address, id, price)),
    claimedRegion: () => {
      const label = screen.getByText(variant === "detailed" ? "Pool:position.card.claimedReward.title" : "Earn:positions.card.claimedRewards");
      return variant === "detailed" ? label.parentElement! : label.parentElement!.nextElementSibling as HTMLElement;
    },
  };
};

describe.each<Variant>(["detailed", "common"])("%s position claimed rewards", variant => {
  beforeEach(() => {
    getPositionRewardsByAddressAndId.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it.each([false, true])("shows captured USD and raw-token decimals even after transfer or closure (closed=%s)", async closed => {
    getPositionRewardsByAddressAndId.mockResolvedValue(rewards);
    const { claimedRegion, rerenderCard } = renderCard(variant, closed);

    await waitFor(() => expect(within(claimedRegion()).getByText("$24")).toBeInTheDocument());
    expect(getPositionRewardsByAddressAndId).toHaveBeenCalledWith("g1pastrecipient", "42");
    const tooltip = within(claimedRegion()).getByRole("tooltip");
    expect(tooltip).toHaveTextContent("$12");
    expect(tooltip).toHaveTextContent("$5");
    expect(tooltip).toHaveTextContent("$7");
    expect(within(tooltip).getByText("123.456789")).toBeInTheDocument();
    expect(within(tooltip).getByText("1.23")).toBeInTheDocument();
    expect(within(tooltip).getByText("delisted")).toBeInTheDocument();
    expect(claimedRegion()).not.toHaveTextContent("$999");

    rerenderCard("g1pastrecipient", "42", "9000");
    expect(within(claimedRegion()).getByText("$24")).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("$12");
  });

  it.each(["recipient", "position"])("removes the previous history while another %s loads or fails", async scope => {
    getPositionRewardsByAddressAndId.mockResolvedValueOnce(rewards);
    const { claimedRegion, rerenderCard } = renderCard(variant);
    await waitFor(() => expect(within(claimedRegion()).getByText("$24")).toBeInTheDocument());

    getPositionRewardsByAddressAndId.mockRejectedValue(new Error("history offline"));
    rerenderCard(scope === "recipient" ? "g1another" : "g1pastrecipient", scope === "position" ? "43" : "42");
    expect(within(claimedRegion()).queryByText("$24")).not.toBeInTheDocument();
    expect(within(claimedRegion()).queryByRole("tooltip")).not.toBeInTheDocument();
    await waitFor(() => expect(within(claimedRegion()).getByText("-")).toBeInTheDocument());
    expect(claimedRegion()).not.toHaveTextContent("$999");
  });

  it("distinguishes a successful empty history from an unavailable one", async () => {
    getPositionRewardsByAddressAndId.mockResolvedValue({
      ...rewards,
      claimed: { swapFee: [], internalReward: [], externalReward: [] },
      totalUsd: {
        ...rewards.totalUsd,
        claimed: { swapFee: "0", internalReward: "0", externalReward: "0", total: "0" },
      },
    });
    const { claimedRegion } = renderCard(variant);

    await waitFor(() => expect(within(claimedRegion()).getByText("$0")).toBeInTheDocument());
    expect(within(claimedRegion()).queryByRole("tooltip")).not.toBeInTheDocument();
    expect(claimedRegion()).not.toHaveTextContent("$999");
  });
});
