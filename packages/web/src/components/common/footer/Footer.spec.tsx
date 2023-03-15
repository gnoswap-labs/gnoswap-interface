import Footer from "./Footer";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Footer Component", () => {
  it("should render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <Footer />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
