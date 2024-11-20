import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SupplyOverview from "./SupplyOverview";

describe("SupplyOverview Component", () => {
  it("SupplyOverview render", () => {
    const mockProps = {
      supplyOverviewInfo: {
        totalSupply: "1,000,000,000 GNOS",
        circulatingSupply: "218,184,885 GNOS",
        progressBar: "580 GNOS",
        dailyBlockEmissions: "580 GNOS",
        totalStaked: "152,412,148 GNOS",
        stakingRatio: "55.15%",
      },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SupplyOverview {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
