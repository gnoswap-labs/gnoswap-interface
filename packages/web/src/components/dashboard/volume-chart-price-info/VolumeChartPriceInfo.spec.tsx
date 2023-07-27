import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import VolumeChartPriceInfo from "./VolumeChartPriceInfo";

describe("VolumeChartPriceInfo Component", () => {
  it("VolumeChartPriceInfo render", () => {
    const mockProps = {
      volumePriceInfo: { amount: "$100,450,000", fee: "$12,231" },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <VolumeChartPriceInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
