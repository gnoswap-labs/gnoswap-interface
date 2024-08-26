import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import GovernanceDetail from "./GovernanceDetail";

describe("GovernanceDetail Component", () => {
  it("GovernanceDetail render", () => {
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
          <GovernanceDetail {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
  });
});
