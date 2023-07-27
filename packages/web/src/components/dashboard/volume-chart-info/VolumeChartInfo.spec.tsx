import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import VolumeChartInfo from "./VolumeChartInfo";

describe("VolumeChartInfo Component", () => {
  it("VolumeChartInfo render", () => {
    const mockProps = {};

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <VolumeChartInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
