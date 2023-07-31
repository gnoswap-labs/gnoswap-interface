import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenChartGraphTab, { TokenChartGraphTabProps } from "./TokenChartGraphTab";

describe('TokenChartGraphTab Component', () => {
  it('TokenChartGraphTab render', () => {
    const args: TokenChartGraphTabProps = {
      currentTab: "1D",
      changeTab: () => { return; }
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenChartGraphTab {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});