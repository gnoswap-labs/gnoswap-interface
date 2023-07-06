import ThemeModeButton from "./ThemeModeButton";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("ThemeModeButton Component", () => {
  it("should render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ThemeModeButton />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
