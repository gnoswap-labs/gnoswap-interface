import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { PoolStakingModel } from "@models/pool/pool-staking";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import IncentivizeTokenDetailTooltipContent from "./IncentivizeTokenDetailTooltipContent";

jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ getGnotPath: (token: PoolStakingModel["rewardToken"]) => token }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const incentive = (symbol: string, startTimestamp: string, endTimestamp: string, isRefunded = "N") =>
  ({
    incentiveType: "EXTERNAL",
    rewardToken: { path: symbol, symbol, displaySymbol: symbol, decimals: 6, logoURI: "" },
    startTimestamp,
    endTimestamp,
    isRefunded,
    incentivizedAmount: "10000000",
    remainingAmount: "5000000",
  } as PoolStakingModel);

describe("current staking reward tooltip", () => {
  afterEach(() => jest.useRealTimers());

  it("shows distributing rewards but not ended, future, or refunded campaigns", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-09-29T00:00:00Z"));
    const rows = [
      incentive("ENDED", "2026-09-01T00:00:00Z", "2026-09-29T00:00:00Z"),
      incentive("ACTIVE", "2026-09-29T00:00:00Z", "2026-09-29T00:01:00Z"),
      incentive("FUTURE", "2026-09-29T00:01:00Z", "2026-10-01T00:00:00Z"),
      incentive("REFUNDED", "2026-09-01T00:00:00Z", "2026-10-01T00:00:00Z", "Y"),
    ];

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <IncentivizeTokenDetailTooltipContent poolStakings={rows} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
    expect(screen.queryByText("ENDED")).not.toBeInTheDocument();
    expect(screen.queryByText("FUTURE")).not.toBeInTheDocument();
    expect(screen.queryByText("REFUNDED")).not.toBeInTheDocument();
  });
});
