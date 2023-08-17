import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapLiquidity from "./SwapLiquidity";
import { dummyLiquidityList } from "@containers/swap-liquidity-container/SwapLiquidityContainer";

describe("SwapLiquidity Component", () => {
  it("SwapLiquidity render", () => {
    const mockProps = {
      liquiditys: dummyLiquidityList,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapLiquidity {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
