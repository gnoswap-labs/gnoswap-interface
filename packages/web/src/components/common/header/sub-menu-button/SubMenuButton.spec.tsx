import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SubMenuButton from "./SubMenuButton";

describe("SubMenuButton Component", () => {
  it("SubMenuButton render", () => {
    const args = {
      sideMenuToggle: false,
      onSideMenuToggle: () => { return; }
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SubMenuButton {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});