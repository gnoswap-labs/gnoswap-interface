import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import PoolPairInfoHeader from "./PoolPairInfoHeader";
import { PoolRepositoryMock } from "@repositories/pool";
import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context";
import { createMockRouter } from "../../../../../../test-utils/createMockRouter";

const poolRepository = new PoolRepositoryMock();

describe("PoolPairInfoHeader Component", () => {
  it("PoolPairInfoHeader render", async () => {
    const pool = (await poolRepository.getPoolDetailByPoolPath());
    const mockProps = {
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      feeStr: "0.01%",
      incentivizedType: pool.incentiveType,
      rewardTokens: [],
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
                <PoolPairInfoHeader {...mockProps} />
              </GnoswapThemeProvider>
            </GnoswapServiceProvider>
          </JotaiProvider>
        </QueryClientProvider>
      </AppRouterContext.Provider>
    );
  });
});
