import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TvlChartPriceInfo from "./TvlChartPriceInfo";

describe("TvlChartPriceInfo Component", () => {
  it("TvlChartPriceInfo render", () => {
    const mockProps = {
      tvlPriceInfo: { amount: "$100,450,000" },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TvlChartPriceInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
