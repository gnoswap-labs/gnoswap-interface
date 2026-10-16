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
  roundId: 1,
  positionStakingPoint: "0",
  gnsDelegationPoint: "0",
  swapPoint: "0",
  swapRawPoint: "0",
  swapCapPoint: "0",
  isProvisional: true,
  usdDetail: null,
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

  const renderRow = (data: Partial<LeaderboardUser>) =>
    render(
      <GnoswapThemeProvider>
        <LeaderboardTableRow
          myAddress={undefined}
          data={{ ...createLeaderboardUser(1), ...data }}
          tdWidths={[100, 100, 100, 100, 100, 100]}
          isMobile={false}
        />
      </GnoswapThemeProvider>,
    );

  it("shows the swap points before the cap, the cap and the counted points on hover", () => {
    renderRow({
      swapPoint: "123.456",
      swapRawPoint: "900",
      swapCapPoint: "4567.891",
      positionStakingPoint: "1000",
      gnsDelegationPoint: "1189.297",
      referralPoint: "12.3",
      totalPoint: "2335.053",
    });

    expect(screen.queryByText("Leaderboard:list.column.swapFeesPaid")).not.toBeInTheDocument();
    expect(screen.getByText("Leaderboard:list.column.swapRaw")).toBeInTheDocument();
    expect(screen.getByText("900")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard:list.column.swapCap")).toBeInTheDocument();
    expect(screen.getByText("4,567.89")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard:list.column.counted")).toBeInTheDocument();
    // The swap column, its counted row and the point composition show the accepted swap points.
    expect(screen.getAllByText("123.45")).toHaveLength(3);
    expect(screen.queryByText("Leaderboard:list.column.swapCapWarning")).not.toBeInTheDocument();
  });

  it("warns when the swap points before the cap exceed the cap", () => {
    renderRow({ swapPoint: "50", swapRawPoint: "900", swapCapPoint: "50" });

    expect(screen.getByText("Leaderboard:list.column.swapCapWarning")).toBeInTheDocument();
  });

  it("shows the point composition with the provisional global cap ratio and the total", () => {
    renderRow({
      swapPoint: "45",
      swapRawPoint: "90",
      swapCapPoint: "500",
      positionStakingPoint: "1000",
      gnsDelegationPoint: "1189.297",
      referralPoint: "12.3",
      totalPoint: "2246.597",
      isProvisional: true,
    });

    expect(screen.getAllByText("1,000")).toHaveLength(2);
    expect(screen.getAllByText("1,189.29")).toHaveLength(2);
    expect(screen.getByText("12.3")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard:list.column.globalCapRatio")).toBeInTheDocument();
    expect(screen.getByText("0.50 (Leaderboard:list.column.provisional)")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard:list.column.total")).toBeInTheDocument();
    expect(screen.getAllByText("2,246.59")).toHaveLength(2);
    // Staking is the position staking points and Delegation the GNS delegation points.
    expect(screen.getByText("Leaderboard:list.column.staking")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard:list.column.delegation")).toBeInTheDocument();
    expect(screen.queryByText("Leaderboard:list.column.position")).not.toBeInTheDocument();
    expect(screen.queryByText("Leaderboard:list.column.xGNS")).not.toBeInTheDocument();
  });

  it("shows no global cap ratio without swap points to derive it from", () => {
    renderRow({ isProvisional: false });

    expect(screen.getByText("Leaderboard:list.column.globalCapRatio").nextSibling).toHaveTextContent("-");
  });
});
