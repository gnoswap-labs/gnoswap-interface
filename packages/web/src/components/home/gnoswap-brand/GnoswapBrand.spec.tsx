import GnoswapBrand from "./GnoswapBrand";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Gnoswap Component", () => {
  it("should render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <GnoswapBrand onClickSns={() => { }} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
