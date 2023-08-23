import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import DashboardOverview from "./DashboardOverview";
import { DEVICE_TYPE } from "@styles/media";

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
      },
      governenceOverviewInfo: {
        totalXgnosIssued: "59,144,225 xGNOS",
        holders: "14,072",
        passedProposals: "125",
        activeProposals: "2",
        communityPool: "2,412,148 GNOS",
      },
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
