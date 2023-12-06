import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SelectToken, { SelectTokenProps } from "./SelectToken";

describe("SelectToken Component", () => {
  it("SelectToken render", () => {
    const args: SelectTokenProps = {
      keyword: "",
      defaultTokens: [],
      tokens: [],
      tokenPrices: {},
      changeKeyword: () => { return; },
      changeToken: () => { return; },
      close: () => { return; },
      themeKey: "dark"
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SelectToken {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});