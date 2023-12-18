import OverlapTokenLogo from "./OverlapTokenLogo";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("OverlapTokenLogo Component", () => {
  it("OverlapTokenLogo render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <OverlapTokenLogo
            tokens={[]}
            size={36}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
