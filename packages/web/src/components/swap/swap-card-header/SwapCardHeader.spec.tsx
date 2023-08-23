import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapCardHeader from "./SwapCardHeader";

describe("SwapCardHeader Component", () => {
  it("SwapCardHeader render", () => {
    const mockProps = {
      settingMenuToggle: true,
      onSettingMenu: () => null,
      tolerance: "",
      changeTolerance: () => null,
      resetTolerance: () => null,
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
