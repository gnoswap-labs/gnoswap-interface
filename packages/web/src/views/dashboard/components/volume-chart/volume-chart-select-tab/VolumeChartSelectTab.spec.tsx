import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import VolumeChartSelectTab from "./VolumeChartSelectTab";
import { CHART_TYPE } from "@constants/option.constant";

describe("VolumeChartSelectTab Component", () => {
  it("VolumeChartSelectTab render", () => {
    const mockProps = {
      volumeChartType: "All" as CHART_TYPE,
      changeVolumeChartType: () => null,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <VolumeChartSelectTab {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
