import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { liquidityInit } from "@containers/my-liquidity-container/MyLiquidityContainer";
import MyLiquidity from "./MyLiquidity";
import { DEVICE_TYPE } from "@styles/media";

describe("MyLiquidity Component", () => {
  it("MyLiquidity render", () => {
    const mockProps = {
      info: liquidityInit,
      breakpoint: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <MyLiquidity {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
