import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import GovernanceOverview from "./GovernanceOverview";

describe("GovernanceOverview Component", () => {
  it("GovernanceOverview render", () => {
    const mockProps = {
      governenceOverviewInfo: {
        totalXgnosIssued: "59,144,225 xGNOS",
        holders: "14,072",
        passedProposals: "125",
        activeProposals: "2",
        communityPool: "2,412,148 GNOS",
      },
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
