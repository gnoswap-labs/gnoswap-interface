import LoadingSpinner from "./LoadingSpinner";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("LoadingSpinner Component", () => {
  it("LoadingSpinner render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <LoadingSpinner />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
