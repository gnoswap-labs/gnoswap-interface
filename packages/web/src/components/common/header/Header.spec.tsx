import Header from "./Header";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Header Component", () => {
  it("should render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Header />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
