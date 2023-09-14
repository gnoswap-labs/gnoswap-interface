import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import PoolGraph, { PoolGraphProps } from "./PoolGraph";

describe("PoolGraph Component", () => {
  it("PoolGraph render", () => {
    const args: PoolGraphProps = {
      ticks: []
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <PoolGraph {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});