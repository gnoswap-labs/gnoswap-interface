import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SimpleLineGraph, { SimpleLineGraphProps } from "./SimpleLineGraph";

describe('SimpleLineGraph Component', () => {
  it('SimpleLineGraph render', () => {
    const args: SimpleLineGraphProps = {
      datas: []
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SimpleLineGraph {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});