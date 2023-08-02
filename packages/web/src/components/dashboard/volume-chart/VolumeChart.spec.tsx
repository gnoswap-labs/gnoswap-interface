import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import VolumeChart from "./VolumeChart";
import { CHART_TYPE } from "@constants/option.constant";

describe("VolumeChart Component", () => {
  it("VolumeChart render", () => {
    const mockProps = {
      volumeChartType: CHART_TYPE["7D"],
      changeVolumeChartType: () => { },
      volumePriceInfo: { amount: "$100,450,000", fee: "$12,231" },
      volumeChartInfo: { xAxisLabels: [], datas: [] },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <VolumeChart {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
