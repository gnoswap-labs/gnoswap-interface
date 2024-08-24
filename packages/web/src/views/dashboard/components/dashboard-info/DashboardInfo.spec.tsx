import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";

import DashboardInfo from "./DashboardInfo";

describe("DashboardInfo Component", () => {
  it("DashboardInfo render", () => {
    const mockProps = {
      dashboardTokenInfo: {
        gnosAmount: "$0.7425",
        gnotAmount: "$1.8852",
      },
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
      loading: false,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <DashboardInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
