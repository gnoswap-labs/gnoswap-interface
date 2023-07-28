import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenChartGraph, { TokenChartGraphProps } from "./TokenChartGraph";

describe('TokenChartGraph Component', () => {
  it('TokenChartGraph render', () => {
    const args: TokenChartGraphProps = {
      datas: [],
      xAxisLabels: [],
      yAxisLabels: [],
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenChartGraph {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});