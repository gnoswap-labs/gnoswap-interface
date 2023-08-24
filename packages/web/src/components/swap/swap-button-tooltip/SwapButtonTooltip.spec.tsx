import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapButtonTooltip from "./SwapButtonTooltip";
import { dummySwapGasInfo } from "@containers/swap-container/SwapContainer";

describe("SwapButtonTooltip Component", () => {
  it("SwapButtonTooltip render", () => {
    const mockProps = {
      swapGasInfo: dummySwapGasInfo,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapButtonTooltip {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
