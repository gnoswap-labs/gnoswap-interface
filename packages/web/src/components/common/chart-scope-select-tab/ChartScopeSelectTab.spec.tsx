import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import ChartScopeSelectTab, { TAB_SIZE } from "./ChartScopeSelectTab";
import { CHART_TYPE } from "@constants/option.constant";

describe("ChartScopeSelectTab Component", () => {
  it("ChartScopeSelectTab render", () => {
    const mockProps = {
      selected: "All" as CHART_TYPE,
      onChange: () => null,
      list: [],
      size: "MEDIUM" as TAB_SIZE,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ChartScopeSelectTab {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
