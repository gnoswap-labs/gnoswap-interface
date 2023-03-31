import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenListHeader from "./TokenListHeader";
import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";

describe("TokenListHeader Component", () => {
  it("TokenListHeader render", () => {
    const mockProps = {
      tokenType: TOKEN_TYPE.ALL,
      changeTokenType: () => {},
      search: () => {},
      keyword: "",
    };

    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <TokenListHeader {...mockProps} />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
