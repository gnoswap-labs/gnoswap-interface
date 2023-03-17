import ThemeModeButton from "./ThemeModeButton";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("ThemeModeButton Component", () => {
  it("should render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <ThemeModeButton />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
