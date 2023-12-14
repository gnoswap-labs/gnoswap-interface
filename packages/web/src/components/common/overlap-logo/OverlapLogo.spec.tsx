import Overlap from "./OverlapLogo";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Overlap Component", () => {
  it("Overlap render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Overlap
            logos={[]}
            size={36}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
