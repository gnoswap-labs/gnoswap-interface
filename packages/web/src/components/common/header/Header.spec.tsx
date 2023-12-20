import Header from "./Header";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { RecentdummyToken } from "@containers/header-container/HeaderContainer";
import { DEVICE_TYPE } from "@styles/media";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";

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
      tokens: [],
      isFetched: true,
      error: null,
      search: () => null,
      keyword: "",
      breakpoint: DEVICE_TYPE.WEB,
      themeKey: "dark" as const,
      switchNetwork: () => null,
      isSwitchNetwork: false,
      loadingConnect: "",
      mostLiquidity: [],
      popularTokens: [],
      recents: [],
      faucet: () => null,
      faucetLoading: false,
    };

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          refetchOnReconnect: false,
          refetchOnWindowFocus: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <GnoswapServiceProvider>
            <GnoswapThemeProvider>
              <Header {...mockProps} />
            </GnoswapThemeProvider>
          </GnoswapServiceProvider>
        </JotaiProvider>
      </QueryClientProvider>,
    );
  });
});
