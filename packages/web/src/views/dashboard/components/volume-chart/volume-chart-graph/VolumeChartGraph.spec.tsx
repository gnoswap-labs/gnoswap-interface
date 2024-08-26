import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import VolumeChartGraph, { VolumeChartGraphProps } from "./VolumeChartGraph";

describe("VolumeChartGraph Component", () => {
  it("VolumeChartGraph render", () => {
    const args: VolumeChartGraphProps = {
      datas: [],
      xAxisLabels: [],
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <VolumeChartGraph {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});