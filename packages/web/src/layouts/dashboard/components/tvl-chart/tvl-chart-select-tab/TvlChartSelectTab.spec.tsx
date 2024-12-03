import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TvlChartSelectTab from "./TvlChartSelectTab";
import { CHART_TYPE } from "@constants/option.constant";

describe("TvlChartSelectTab Component", () => {
  it("TvlChartSelectTab render", () => {
    const mockProps = {
      tvlChartType: "All" as CHART_TYPE,
      changeTvlChartType: () => null,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TvlChartSelectTab {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
