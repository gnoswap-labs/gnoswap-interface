import DoubleLogo from "./DoubleLogo";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("DoubleLogo Component", () => {
  it("DoubleLogo render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <DoubleLogo
            left="https://picsum.photos/id/7/36/36"
            right="https://picsum.photos/id/101/36/36"
            size={36}
            overlap={8}
          />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
