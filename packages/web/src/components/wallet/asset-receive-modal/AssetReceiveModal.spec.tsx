import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import AssetReceiveModal, { DEFAULT_DEPOSIT_GNOT } from "./AssetReceiveModal";
import { DEVICE_TYPE } from "@styles/media";
import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context";
import { createMockRouter } from "../../../test-utils/createMockRouter";

describe("AssetReceiveModal Component", () => {
  it("AssetReceiveModal render", () => {
    const mockProps = {
      breakpoint: DEVICE_TYPE.WEB,
      depositInfo: DEFAULT_DEPOSIT_GNOT,
      avgBlockTime: 2.2,
      changeToken: () => null,
      close: () => null,
      callback: () => null,
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
      <AppRouterContext.Provider value={createMockRouter({})}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <GnoswapThemeProvider>
              <GnoswapServiceProvider>
                <AssetReceiveModal {...mockProps} />
              </GnoswapServiceProvider>
            </GnoswapThemeProvider>
          </JotaiProvider>,
        </QueryClientProvider>
      </AppRouterContext.Provider>
    );
  });
});
