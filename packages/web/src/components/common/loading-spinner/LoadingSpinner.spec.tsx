import LoadingSpinner from "./LoadingSpinner";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("LoadingSpinner Component", () => {
  it("LoadingSpinner render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <LoadingSpinner />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
