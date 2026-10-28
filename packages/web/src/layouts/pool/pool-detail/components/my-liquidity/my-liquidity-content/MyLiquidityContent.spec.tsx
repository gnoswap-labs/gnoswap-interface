import { fireEvent, render, within } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import type { ComponentProps, ReactNode } from "react";

import { initialPool } from "@models/pool/pool-model";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { PositionRewardsResponse } from "@repositories/position/response";
import { DEVICE_TYPE } from "@styles/media";

import MyLiquidityContent from "./MyLiquidityContent";

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ getGnotPath: (token: TokenModel) => token }),
}));
jest.mock("@components/common/tooltip/Tooltip", () => ({
  __esModule: true,
  default: ({ children, FloatingContent }: { children: ReactNode; FloatingContent?: ReactNode }) => (
    <>
      {children}
      {FloatingContent}
    </>
  ),
}));

const usdc: TokenModel = {
  path: "gno.land/r/demo/usdc",
  priceID: "USDC",
  type: "GRC20",
  chainId: "test",
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
  id: 1,
  lpTokenId: "1",
  poolPath: "pool",
  owner: "g1owner",
  staked: false,
  tickLower: 0,
  tickUpper: 1,
  liquidity: BigInt(0),
  tokenABalance: "0",
  tokenBBalance: "0",
  positionUsdValue: "0",
  unclaimedFeeAAmount: "0",
  unclaimedFeeBAmount: "0",
  apr: "0",
  stakedAt: "",
  rewards: [],
  claimedRewards: [{ rewardType: "SWAP_FEE", rewardToken: { ...usdc, rewardType: "SWAP_FEE" }, claimedAmount: "999" }],
  totalClaimedUsd: "999",
  closed: false,
  usdValue: 0,
  tokenUri: "",
  totalDailyRewardsUsd: "0",
  stakedUsdValue: "0",
  feeTier: "FEE_3000",
  pool: { ...initialPool, tokenA: usdc, tokenB: atom },
};
const baseProps: ComponentProps<typeof MyLiquidityContent> = {
  connected: true,
  positions: [],
  breakpoint: DEVICE_TYPE.WEB,
  isDisabledButton: false,
  claimAll: jest.fn(),
  loadingTransactionClaim: false,
  isOtherPosition: false,
  isLoadingPositionsById: false,
  tokenPrices: {},
  isSwitchNetwork: false,
  tokens: [usdc, atom],
  positionRewards: rewards,
  isLoadingPositionRewards: false,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <JotaiProvider>
    <GnoswapThemeProvider>{children}</GnoswapThemeProvider>
  </JotaiProvider>
);

describe("MyLiquidityContent cumulative claims", () => {
  it("shows captured totals and all tooltip rows for a wallet with no open positions or current prices", () => {
    const { container } = render(<MyLiquidityContent {...baseProps} />, { wrapper });
    const claimed = within(container.querySelectorAll("section")[1]);

    expect(claimed.getByText("$24")).toBeInTheDocument();
    expect(claimed.getByText("123.456789")).toBeInTheDocument();
    expect(claimed.getByText("1.23")).toBeInTheDocument();
    const delistedRow = claimed.getByText("delisted", { selector: "span.position" }).closest(".list");
    expect(delistedRow).toHaveTextContent("-");
    expect(claimed.getByText("$7")).toBeInTheDocument();
    expect(baseProps.claimAll).not.toHaveBeenCalled();
    expect(within(container).queryByRole("button", { name: "Pool:position.card.btn.claimAll" })).toBeNull();
  });

  it.each([false, true])("orders claimed and claimable by pool and keeps historical rows (closed=%s)", closed => {
    const extraToken: TokenModel = {
      ...usdc,
      path: "gno.land/r/demo/extra",
      priceID: usdc.priceID,
      symbol: "EXTRA",
      displaySymbol: "EXTRA",
    };
    const summary: PositionRewardsResponse = {
      ...rewards,
      claimed: {
        ...rewards.claimed,
        swapFee: [
          { tokenPath: "gno.land/r/demo/orphan", amount: "9000000", usdValue: "4" },
          rewards.claimed.swapFee[1],
          { tokenPath: extraToken.path, amount: "2000000", usdValue: "3" },
          rewards.claimed.swapFee[0],
        ],
      },
      totalUsd: {
        ...rewards.totalUsd,
        claimed: { ...rewards.totalUsd.claimed, swapFee: "19", total: "31" },
      },
    };
    const { container } = render(
      <MyLiquidityContent
        {...baseProps}
        tokens={[usdc, atom, extraToken]}
        positionRewards={summary}
        positions={[
          {
            ...position,
            closed,
            rewards: [atom, usdc].map(token => ({
              rewardToken: { ...token, rewardType: "SWAP_FEE" as const },
              totalAmount: "1000000",
              claimableAmount: "1000000",
              claimableUsd: "3",
              apr: null,
            })),
          },
        ]}
      />,
      { wrapper },
    );
    const claimedSection = container.querySelectorAll("section")[1];
    const claimableSection = container.querySelectorAll("section")[2];

    expect(Array.from(claimedSection.querySelectorAll(".coin-info .position"), row => row.textContent)).toEqual([
      "USDC",
      "ATOM",
      "EXTRA",
      "orphan",
      "USDC",
      "delisted",
    ]);
    expect(Array.from(claimableSection.querySelectorAll(".coin-info .position"), row => row.textContent)).toEqual([
      "USDC",
      "ATOM",
    ]);
    expect(claimedSection.querySelector(".content-value")).toHaveTextContent("$31");
    expect(within(claimedSection).getAllByText("$19")).toHaveLength(2);
    expect(within(claimedSection).getByText("123.456789")).toBeInTheDocument();
    expect(within(claimedSection).getByText("1.23")).toBeInTheDocument();
    expect(within(claimedSection).getByText("EXTRA", { selector: "span.position" }).closest(".list")).toHaveTextContent(
      "2",
    );
    expect(
      within(claimedSection).getByText("orphan", { selector: "span.position" }).closest(".list"),
    ).toHaveTextContent("-");
    expect(
      within(claimedSection).getByText("delisted", { selector: "span.position" }).closest(".list"),
    ).toHaveTextContent("-");
    expect(within(claimedSection).getByText("$7")).toBeInTheDocument();
  });

  it("keeps cumulative claims stable when list pagination, closed positions, and live prices change", () => {
    const { container, rerender } = render(<MyLiquidityContent {...baseProps} positions={[position]} />, { wrapper });
    const claimedSection = container.querySelectorAll("section")[1];
    expect(within(claimedSection).getByText("$24")).toBeInTheDocument();

    rerender(
      <MyLiquidityContent
        {...baseProps}
        positions={[position, { ...position, id: 2, closed: true, totalClaimedUsd: "10000" }]}
        tokenPrices={
          { USDC: { usd: "999999" }, ATOM: { usd: "888888" } } as unknown as ComponentProps<
            typeof MyLiquidityContent
          >["tokenPrices"]
        }
      />,
    );

    expect(within(claimedSection).getByText("$24")).toBeInTheDocument();
    expect(within(claimedSection).getByText("123.456789")).toBeInTheDocument();
    expect(within(claimedSection).queryByText("$999")).toBeNull();
  });

  it("does not replace a failed historical summary with loaded position claims", () => {
    const { container } = render(<MyLiquidityContent {...baseProps} positions={[position]} positionRewards={null} />, {
      wrapper,
    });
    const claimedSection = container.querySelectorAll("section")[1];
    expect(claimedSection.querySelector(".content-value")).toHaveTextContent("-");
    expect(within(claimedSection).queryByText("$999")).toBeNull();
    expect(within(claimedSection).queryByText("USDC")).toBeNull();
  });

  it("loads historical claims independently of the position list", () => {
    const { container, rerender } = render(<MyLiquidityContent {...baseProps} isLoadingPositionsById />, { wrapper });
    const claimedSection = container.querySelectorAll("section")[1];
    expect(within(claimedSection).getByText("$24")).toBeInTheDocument();

    rerender(<MyLiquidityContent {...baseProps} positionRewards={null} isLoadingPositionRewards />);
    expect(claimedSection.querySelector(".content-value")).toBeNull();
    expect(within(claimedSection).queryByText("$24")).toBeNull();
  });

  it("distinguishes a successful empty history from an unavailable history", () => {
    const emptyRewards: PositionRewardsResponse = {
      ...rewards,
      claimed: { swapFee: [], internalReward: [], externalReward: [] },
      totalUsd: {
        ...rewards.totalUsd,
        claimed: { swapFee: "0", internalReward: "0", externalReward: "0", total: "0" },
      },
    };
    const { container } = render(<MyLiquidityContent {...baseProps} positionRewards={emptyRewards} />, { wrapper });
    expect(container.querySelectorAll("section")[1].querySelector(".content-value")).toHaveTextContent("$0");
  });

  it("keeps Claim All driven by current open positions when the historical request fails", () => {
    const claimAll = jest.fn();
    const openPosition: PoolPositionModel = {
      ...position,
      rewards: [
        {
          rewardToken: { ...usdc, rewardType: "SWAP_FEE" },
          totalAmount: "1000000",
          claimableAmount: "1000000",
          claimableUsd: "3",
          apr: null,
        },
      ],
    };
    const { container } = render(
      <MyLiquidityContent
        {...baseProps}
        positions={[openPosition]}
        positionRewards={null}
        claimAll={claimAll}
        tokenPrices={
          { USDC: { usd: "3" }, ATOM: { usd: "1" } } as unknown as ComponentProps<
            typeof MyLiquidityContent
          >["tokenPrices"]
        }
      />,
      { wrapper },
    );
    const button = within(container).getByRole("button", { name: "Pool:position.card.btn.claimAll" });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(claimAll).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll("section")[1].querySelector(".content-value")).toHaveTextContent("-");
  });
});

it("preserves token B's nine decimal places in the balance tooltip when token A has six", () => {
  const tokenB = { ...atom, decimals: 9 };
  const mixedDecimalPosition = {
    ...position,
    tokenABalance: "2.654321",
    tokenBBalance: "1.123456789",
    pool: { ...position.pool, tokenB },
  };
  const { container } = render(
    <MyLiquidityContent {...baseProps} positions={[mixedDecimalPosition]} tokens={[usdc, tokenB]} />,
    { wrapper },
  );
  expect(within(container).getByText("1.123456789", { exact: true })).toBeInTheDocument();
  expect(within(container).getByText("2.654321", { exact: true })).toBeInTheDocument();
});
