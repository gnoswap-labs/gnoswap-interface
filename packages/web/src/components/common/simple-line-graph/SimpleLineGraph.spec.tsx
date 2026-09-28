import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SimpleLineGraph, { SimpleLineGraphProps } from "./SimpleLineGraph";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";

describe("SimpleLineGraph Component", () => {
  it("SimpleLineGraph render", () => {
    const args: SimpleLineGraphProps = {
      datas: [],
      status: MATH_NEGATIVE_TYPE.NONE,
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
