import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GovernanceOverview from "./GovernanceOverview";

describe("GovernanceOverview Component", () => {
  it("GovernanceOverview render", () => {
    const mockProps = {
      governanceOverviewInfo: {
        totalDelegated: "59,144,225 xGNOS",
        holders: "14,072",
        passedCount: "125",
        activeCount: "2",
        communityPool: "2,412,148 GNOS",
      },
      loading: false,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <GovernanceOverview {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
