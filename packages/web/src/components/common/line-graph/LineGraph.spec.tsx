import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import LineGraph, { LineGraphProps } from "./LineGraph";

describe('LineGraph Component', () => {
  it('LineGraph render', () => {
    const args: LineGraphProps = {
      color: "#FFFFFF",
      datas: []
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <LineGraph {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});