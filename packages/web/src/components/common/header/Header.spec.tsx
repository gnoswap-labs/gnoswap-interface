import Header from "./Header";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { RecentdummyToken } from "@containers/header-container/HeaderContainer";

describe("Header Component", () => {
  it("should render", () => {
    const mockProps = {
      pathname: "/",
      isConnected: true,
      sideMenuToggle: true,
      onSideMenuToggle: () => null,
      searchMenuToggle: true,
      onSearchMenuToggle: () => null,
      tokens: RecentdummyToken,
      isFetched: true,
      error: null,
      search: () => null,
      keyword: "",
    };
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Header {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
