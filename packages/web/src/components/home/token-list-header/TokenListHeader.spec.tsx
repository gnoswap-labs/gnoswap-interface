import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenListHeader from "./TokenListHeader";
import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";

describe("TokenListHeader Component", () => {
  it("TokenListHeader render", () => {
    const mockProps = {
      tokenType: TOKEN_TYPE.ALL,
      changeTokenType: () => { },
      search: () => { },
      keyword: "",
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
