import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import DashboardOverview from "./DashboardOverview";

describe("DashboardOverview Component", () => {
  it("DashboardOverview render", () => {
    const mockProps = {
      supplyOverviewInfo: {
        totalSupply: "1,000,000,000 GNOS",
        circulatingSupply: "218,184,885 GNOS",
        progressBar: "580 GNOS",
        dailyBlockEmissions: "580 GNOS",
        totalStaked: "152,412,148 GNOS",
        stakingRatio: "55.15%",
        dailyBlockEmissionsInfo: {
          liquidityStaking: "580 GNOS",
          devOps: "580 GNOS",
          community: "580 GNOS",
        },
      },
      governanceOverviewInfo: {
        totalDelegated: "-",
        holders: "-",
        passedCount: "-",
        activeCount: "-",
        communityPool: "-",
      },
      loading: false,
      breakpoint: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <DashboardOverview {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
