import SearchInput from "./SearchInput";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("SearchInput Component", () => {
  it("Default search input", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <SearchInput width={400} height={48} placeholder="Search" />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });

  it("Full width search input", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <SearchInput fullWidth height={48} placeholder="Full Width" />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
