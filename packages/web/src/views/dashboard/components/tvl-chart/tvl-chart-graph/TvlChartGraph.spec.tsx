import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TvlChartGraph, { TvlChartGraphProps } from "./TvlChartGraph";

describe("TvlChartGraph Component", () => {
  it("TvlChartGraph render", () => {
    const args: TvlChartGraphProps = {
      datas: [],
      xAxisLabels: [],
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