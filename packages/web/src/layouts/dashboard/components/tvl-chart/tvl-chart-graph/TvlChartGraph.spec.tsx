import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TvlChartGraph, { TvlChartGraphProps } from "./TvlChartGraph";
import { CHART_TYPE } from "@constants/option.constant";

describe("TvlChartGraph Component", () => {
  it("TvlChartGraph render", () => {
    const args: TvlChartGraphProps = {
      datas: [],
      tvlChartType: CHART_TYPE["7D"],
      yAxisLabels: [],
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TvlChartGraph {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
