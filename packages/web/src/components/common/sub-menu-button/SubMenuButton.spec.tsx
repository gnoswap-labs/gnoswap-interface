import SubMenuButton from "./SubMenuButton";
import { render } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { Provider as JotaiProvider } from "jotai";

describe("SubMenuButton Component", () => {
  it("SubMenuButton render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SubMenuButton sideMenuToggle={true} onSideMenuToggle={() => {}} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
