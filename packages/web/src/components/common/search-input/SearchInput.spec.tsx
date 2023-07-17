import SearchInput from "./SearchInput";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("SearchInput Component", () => {
  it("Default search input", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SearchInput width={400} height={48} placeholder="Search" />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });

  it("Full width search input", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SearchInput fullWidth height={48} placeholder="Full Width" />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
