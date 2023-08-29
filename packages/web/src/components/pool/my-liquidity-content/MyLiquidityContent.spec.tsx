import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { liquidityInit } from "@containers/my-liquidity-container/MyLiquidityContainer";
import MyLiquidityContent from "./MyLiquidityContent";
import { DEVICE_TYPE } from "@styles/media";

describe("MyLiquidityContent Component", () => {
  it("MyLiquidityContent render", () => {
    const mockProps = {
      content: liquidityInit,
      breakpoint: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <MyLiquidityContent {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
