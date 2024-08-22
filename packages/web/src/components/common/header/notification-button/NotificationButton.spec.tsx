import NotificationButton from "./NotificationButton";
import { render } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { Provider as JotaiProvider } from "jotai";
import { DEVICE_TYPE } from "@styles/media";
import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouterContext, } from "next/dist/shared/lib/app-router-context";
import { createMockRouter } from "../../../../test-utils/createMockRouter";

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
