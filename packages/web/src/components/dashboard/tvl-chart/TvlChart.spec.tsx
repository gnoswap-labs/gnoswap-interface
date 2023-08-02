import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TvlChart from "./TvlChart";
import { CHART_TYPE } from "@constants/option.constant";

describe("TvlChart Component", () => {
  it("TvlChart render", () => {
    const mockProps = {
      tvlChartType: CHART_TYPE["7D"],
      changeTvlChartType: () => { },
      tvlPriceInfo: { amount: "$100,450,000" },
      tvlChartInfo: { xAxisLabels: [], datas: [] },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TvlChart {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
