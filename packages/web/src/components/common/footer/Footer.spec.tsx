import Footer from "./Footer";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Footer Component", () => {
  it("should render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Footer />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
