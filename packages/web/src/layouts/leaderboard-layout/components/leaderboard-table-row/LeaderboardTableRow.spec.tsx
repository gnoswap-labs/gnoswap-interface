import { render, screen } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { LeaderboardVisibilityStatus, LeaderboardUser } from "@repositories/leaderboard/response/common/types";
import LeaderboardTableRow from "./LeaderboardTableRow";

jest.mock("@components/common/tooltip/Tooltip", () => {
  return function MockTooltip({
    children,
    FloatingContent,
  }: {
    readonly children: React.ReactNode;
    readonly FloatingContent?: React.ReactNode;
  }) {
    return (
      <>
        {children}
        <div data-testid="tooltip-content">{FloatingContent}</div>
      </>
    );
  };
});

jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const createLeaderboardUser = (rank: number): LeaderboardUser => ({
  accountAddress: "g1testaddress000000000000000000000000000000000",
  accountName: "",
  governanceRewardsPoint: "0",
  governanceRewardsUsd: "0",
  hiddenYn: LeaderboardVisibilityStatus.VISIBLE,
  paidSwapFeePoint: "0",
  providedLiquidityFeePoint: "0",
  providedLiquidityFeeUsd: "0",
  rank,
  referralPoint: "0",
  referrerAddress: "",
  stakingRewardsPoint: "0",
  stakingRewardsUsd: "0",
  swapFeeUsd: "0",
  totalPoint: "0",
});

const createApiLeaderboardUser = (rank: string): LeaderboardUser => {
  return JSON.parse(JSON.stringify({ ...createLeaderboardUser(0), rank }));
};

describe("LeaderboardTableRow", () => {
  it("displays the global rank when a page rank offset is provided", () => {
    render(
      <GnoswapThemeProvider>
        <LeaderboardTableRow
          myAddress={undefined}
          data={createLeaderboardUser(1)}
          tdWidths={[100, 100, 100, 100, 100, 100]}
          isMobile={false}
          rankOffset={100}
        />
      </GnoswapThemeProvider>,
    );

    expect(screen.getByText("#101")).toBeInTheDocument();
  });

  it("keeps the API rank when it is already greater than the page offset", () => {
    render(
      <GnoswapThemeProvider>
        <LeaderboardTableRow
          myAddress={undefined}
          data={createLeaderboardUser(101)}
          tdWidths={[100, 100, 100, 100, 100, 100]}
          isMobile={false}
          rankOffset={100}
        />
      </GnoswapThemeProvider>,
    );

    expect(screen.getByText("#101")).toBeInTheDocument();
    expect(screen.queryByText("#201")).not.toBeInTheDocument();
  });

  it("coerces a serialized API rank before applying the page offset", () => {
    render(
      <GnoswapThemeProvider>
        <LeaderboardTableRow
          myAddress={undefined}
          data={createApiLeaderboardUser("1")}
          tdWidths={[100, 100, 100, 100, 100, 100]}
          isMobile={false}
          rankOffset={100}
        />
      </GnoswapThemeProvider>,
    );

    expect(screen.getByText("#101")).toBeInTheDocument();
    expect(screen.queryByText("#1100")).not.toBeInTheDocument();
  });

  it("displays tiny positive USD values with the minimum USD label", () => {
    render(
      <GnoswapThemeProvider>
        <LeaderboardTableRow
          myAddress={undefined}
          data={{
            ...createLeaderboardUser(647),
            governanceRewardsUsd: "0.0000003",
            swapFeeUsd: "0.000000996805274021",
            providedLiquidityFeeUsd: "0.000000969767947872",
            stakingRewardsUsd: "0.0000006",
            paidSwapFeePoint: "0.000000996805274021",
            totalPoint: "0.000000996805274021",
          }}
          tdWidths={[100, 100, 100, 100, 100, 100]}
          isMobile={false}
        />
      </GnoswapThemeProvider>,
    );

    expect(screen.getAllByText("<$0.01")).toHaveLength(3);
    expect(screen.queryByText("$")).not.toBeInTheDocument();
  });

  it("does not expose USD precision below 0.01", () => {
    render(
      <GnoswapThemeProvider>
        <LeaderboardTableRow
          myAddress={undefined}
          data={{
            ...createLeaderboardUser(647),
            swapFeeUsd: "0.009",
            providedLiquidityFeeUsd: "0.009",
            stakingRewardsUsd: "0.009",
            governanceRewardsUsd: "0.009",
          }}
          tdWidths={[100, 100, 100, 100, 100, 100]}
          isMobile={false}
        />
      </GnoswapThemeProvider>,
    );

    expect(screen.getAllByText("<$0.01")).toHaveLength(2);
    expect(screen.queryByText("0.009")).not.toBeInTheDocument();
    expect(screen.queryByText("$0.009")).not.toBeInTheDocument();
  });

  it("shows round swap points with the wallet swap cap on hover", () => {
    render(
      <GnoswapThemeProvider>
        <LeaderboardTableRow
          myAddress={undefined}
          data={{
            ...createLeaderboardUser(1),
            roundId: 1,
            swapPoint: "123.456",
            swapRawPoint: "900",
            swapCapPoint: "4567.891",
            positionStakingPoint: "1000",
            gnsDelegationPoint: "1189.297",
            referralPoint: "12.3",
            totalPoint: "2335.053",
          }}
          tdWidths={[100, 100, 100, 100, 100, 100]}
          isMobile={false}
        />
      </GnoswapThemeProvider>,
    );

    // The swap column shows the accepted swap points; its tooltip and the
    // point composition both show the swap points before the cap and the cap.
    expect(screen.getAllByText("123.45")).toHaveLength(2);
    expect(screen.getAllByText("Leaderboard:list.column.swapRaw")).toHaveLength(2);
    expect(screen.getAllByText("900")).toHaveLength(2);
    expect(screen.getAllByText("Leaderboard:list.column.swapCap")).toHaveLength(2);
    expect(screen.getAllByText("4,567.89")).toHaveLength(2);
    expect(screen.getByText("Leaderboard:list.column.tooltip.swapCap")).toBeInTheDocument();
    expect(screen.getAllByText("1,000")).toHaveLength(2);
    expect(screen.getAllByText("1,189.29")).toHaveLength(2);
    // Round leaderboards have no separate staking reward points.
    expect(screen.queryByText("Leaderboard:list.column.staking")).not.toBeInTheDocument();
    expect(screen.queryByText("<$0.01")).not.toBeInTheDocument();
  });

  it("keeps the legacy USD columns without the swap cap", () => {
    render(
      <GnoswapThemeProvider>
        <LeaderboardTableRow
          myAddress={undefined}
          data={{ ...createLeaderboardUser(1), swapFeeUsd: "12.5" }}
          tdWidths={[100, 100, 100, 100, 100, 100]}
          isMobile={false}
        />
      </GnoswapThemeProvider>,
    );

    expect(screen.getByText(/^\$12\.5/)).toBeInTheDocument();
    expect(screen.queryByText("Leaderboard:list.column.swapCap")).not.toBeInTheDocument();
    expect(screen.queryByText("Leaderboard:list.column.swapRaw")).not.toBeInTheDocument();
    expect(screen.getByText("Leaderboard:list.column.staking")).toBeInTheDocument();
  });
});
