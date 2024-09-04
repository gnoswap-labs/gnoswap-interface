import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenChartInfo, { TokenChartInfoProps } from "./TokenChartInfo";

describe("TokenChartInfo Component", () => {
  it("TokenChartInfo render", () => {
    const args: TokenChartInfoProps = {
      token: {
        name: "",
        symbol: "",
        image: "",
      },
      priceInfo: {
        amount: {
          value: 0,
          denom: ""
        },
        changedRate: 0
      }
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenChartInfo {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});