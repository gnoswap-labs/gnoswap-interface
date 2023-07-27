import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import DashboardLabel from "./DashboardLabel";

describe("DashboardLabel Component", () => {
  it("DashboardLabel render", () => {
    const mockProps = {
      tooltip: "The total supply of GNOS tokens is 1,000,000,000 GNOS.",
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <DashboardLabel {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
