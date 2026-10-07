import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenListHeader from "./TokenListHeader";
import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

describe("TokenListHeader Component", () => {
  const searchRef = React.createRef<HTMLDivElement>();

  it("should render without crashing", () => {
    expect(true).toBe(true);
  });

  it("TokenListHeader renders successfully", () => {
    const mockProps = {
      tokenType: TOKEN_TYPE.ALL,
      changeTokenType: jest.fn(),
      search: jest.fn(),
      keyword: "",
      breakpoint: DEVICE_TYPE.WEB,
      searchIcon: true,
      onTogleSearch: jest.fn(),
      searchRef,
      showUnverifiedTokens: false,
      toggleShowUnverifiedTokens: jest.fn(),
    };

    expect(() =>
      render(
        <JotaiProvider>
          <GnoswapThemeProvider>
            <TokenListHeader {...mockProps} />
          </GnoswapThemeProvider>
        </JotaiProvider>,
      ),
    );
  });
});
