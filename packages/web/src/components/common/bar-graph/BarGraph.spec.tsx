import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import BarGraph, { BarGraphProps } from "./BarGraph";

describe("BarGraph Component", () => {
  it("BarGraph render", () => {
    const args: BarGraphProps = {
      color: "#FFFFFF",
      datas: []
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <BarGraph {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});