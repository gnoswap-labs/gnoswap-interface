import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TvlChartInfo from "./TvlChartInfo";
import { CHART_TYPE } from "@constants/option.constant";

describe("TvlChartInfo Component", () => {
  it("TvlChartInfo render", () => {
    const mockProps = {};

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TvlChartInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
