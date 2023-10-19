import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import GovernanceSummary from "./GovernanceSummary";

describe("GovernanceSummary Component", () => {
  it("GovernanceSummary render", () => {
    const mockProps = {
      governanceDetailInfo: {
        totalXGnosIssued: "59,144,225 xGNOS",
        communityPool: "2,412,148 GNOS",
        passedProposals: "42",
        activeProposals: "2",
      },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <GovernanceSummary {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
  });
});
