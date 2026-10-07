import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import TokenChartInfo, { TokenChartInfoProps } from "./TokenChartInfo";

describe("TokenChartInfo Component", () => {
  it("truncates a long token name while preserving the chart info layout", async () => {
    const args: TokenChartInfoProps = {
      token: {
        name: "FOOTBALL WORLD CUB",
        symbol: "FWC",
        displaySymbol: "FWC",
        image: "",
      },
      priceInfo: {
        amount: {
          value: 1,
          denom: "GNOT",
          status: MATH_NEGATIVE_TYPE.NONE,
        },
        priceGradeType: "NONE",
        changedRate: "0%",
      },
      isEmpty: false,
      loading: false,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenChartInfo {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(await screen.findByText("FOOTBALL...")).toBeInTheDocument();
    expect(screen.queryByText("FOOTBALL WORLD CUB")).not.toBeInTheDocument();
  });
});
