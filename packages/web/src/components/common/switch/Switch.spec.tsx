import Switch from "./Switch";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Switch Component", () => {
  it("should render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <Switch checked={true} onChange={() => {}} />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
