import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import BarAreaGraph, { BarAreaGraphProps } from "./BarAreaGraph";

describe('BarAreaGraph Component', () => {
  it('BarAreaGraph render', () => {
    const args: BarAreaGraphProps = {
      datas: []
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <BarAreaGraph {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});