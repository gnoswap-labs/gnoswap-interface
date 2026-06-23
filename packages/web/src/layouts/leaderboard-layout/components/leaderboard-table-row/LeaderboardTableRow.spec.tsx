import { render, screen } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { LeaderboardVisibilityStatus, LeaderboardUser } from "@repositories/leaderboard/response/common/types";
import LeaderboardTableRow from "./LeaderboardTableRow";

jest.mock("@components/common/tooltip/Tooltip", () => {
  return function MockTooltip({ children }: { readonly children: React.ReactNode }) {
    return <>{children}</>;
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

  it("does not expose point precision below 0.01", () => {
    render(
      <GnoswapThemeProvider>
        <LeaderboardTableRow
          myAddress={undefined}
          data={{
            ...createLeaderboardUser(647),
            paidSwapFeePoint: "0.009",
            totalPoint: "0.009",
          }}
          tdWidths={[100, 100, 100, 100, 100, 100]}
          isMobile={false}
        />
      </GnoswapThemeProvider>,
    );

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.queryByText("0.009")).not.toBeInTheDocument();
    expect(screen.queryByText("0.01")).not.toBeInTheDocument();
  });
});
