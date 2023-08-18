import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapCardFeeInfo from "./SwapCardFeeInfo";
import { dummySwapGasInfo } from "@containers/swap-container/SwapContainer";

describe("SwapCardFeeInfo Component", () => {
  it("SwapCardFeeInfo render", () => {
    const mockProps = {
      autoRouter: false,
      showAutoRouter: () => null,
      swapGasInfo: dummySwapGasInfo,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardFeeInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
