import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { liquidityInit } from "@containers/my-liquidity-container/MyLiquidityContainer";
import MyLiquidityHeader from "./MyLiquidityHeader";

describe("MyLiquidityHeader Component", () => {
  it("MyLiquidityHeader render", () => {
    const mockProps = {
      info: liquidityInit.poolInfo,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <MyLiquidityHeader {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
