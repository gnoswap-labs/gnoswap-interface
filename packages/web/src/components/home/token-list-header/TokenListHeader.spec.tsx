import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenListHeader from "./TokenListHeader";
import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";

describe("TokenListHeader Component", () => {
  const searchRef = React.createRef();
  it("TokenListHeader render", () => {
    const mockProps = {
      tokenType: TOKEN_TYPE.ALL,
      changeTokenType: () => {},
      search: () => {},
      keyword: "",
      breakpoint: DEVICE_TYPE.WEB,
      searchIcon: true,
      onTogleSearch: () => null,
      searchRef,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenListHeader {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
