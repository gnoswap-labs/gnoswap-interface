import GnoswapBrand from "./GnoswapBrand";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Gnoswap Component", () => {
  it("should render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <GnoswapBrand onClickSns={() => {}} />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
