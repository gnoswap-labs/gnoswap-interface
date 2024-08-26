import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context";

import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";
import { createMockRouter } from "@test/createMockRouter";

import NotificationButton from "./NotificationButton";

describe("NotificationButton Component", () => {
  it("Notification button", () => {
    const mockProps = {
      breakpoint: DEVICE_TYPE.WEB,
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
            <GnoswapServiceProvider>
              <GnoswapThemeProvider>
                <NotificationButton {...mockProps} />
              </GnoswapThemeProvider>
            </GnoswapServiceProvider>
          </JotaiProvider>
        </QueryClientProvider>,
      </AppRouterContext.Provider>
    );
  });
});
