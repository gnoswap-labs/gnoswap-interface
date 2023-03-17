import Header from "./Header";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Header Component", () => {
  it("should render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <Header />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
