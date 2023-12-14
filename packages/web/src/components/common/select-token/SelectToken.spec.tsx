import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SelectToken, { SelectTokenProps } from "./SelectToken";
import React from "react";
import { DEVICE_TYPE } from "@styles/media";

describe("SelectToken Component", () => {
  const modalRef = React.createRef();
  it("SelectToken render", () => {
    const args: SelectTokenProps = {
      keyword: "",
      defaultTokens: [],
      tokens: [],
      tokenPrices: {},
      changeKeyword: () => { return; },
      changeToken: () => { return; },
      close: () => { return; },
      themeKey: "dark",
      modalRef,
      breakpoint: DEVICE_TYPE.WEB,
      recents: [],
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