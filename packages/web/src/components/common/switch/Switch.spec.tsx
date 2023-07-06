import Switch from "./Switch";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Switch Component", () => {
  it("should render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Switch checked={true} onChange={() => { }} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
