import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import GovernanceSummary from "./GovernanceSummary";

describe("GovernanceSummary Component", () => {
  it("GovernanceSummary render", () => {
    const mockProps = {
      governanceSummary: {
        totalDelegated: 59144225,
        delegatedRatio: 55.12,
        apy: 12.51,
        communityPool: 2412148.12,
      },
      isLoading: false,
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
