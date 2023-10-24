import Header from "./Header";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { RecentdummyToken } from "@containers/header-container/HeaderContainer";
import { DEVICE_TYPE } from "@styles/media";

describe("Header Component", () => {
  it("should render", () => {
    const mockProps = {
      pathname: "/",
      connected: false,
      account: null,
      connectAdenaClient: () => null,
      disconnectWallet: () => null,
      sideMenuToggle: true,
      onSideMenuToggle: () => null,
      searchMenuToggle: true,
      onSearchMenuToggle: () => null,
      tokens: RecentdummyToken,
      isFetched: true,
      error: null,
      search: () => null,
      keyword: "",
      breakpoint: DEVICE_TYPE.WEB,
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
