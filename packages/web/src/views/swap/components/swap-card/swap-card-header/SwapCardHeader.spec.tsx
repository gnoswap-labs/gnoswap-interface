import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapCardHeader from "./SwapCardHeader";

describe("SwapCardHeader Component", () => {
  it("SwapCardHeader render", () => {
    const mockProps = {
      copied: false,
      copyURL: () => null,
      slippage: 0,
      changeSlippage: () => null,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardHeader {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
